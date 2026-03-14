"use server";

import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { type AppRole, appRoles } from "@/lib/roles";
import { requireProfile, requireRole } from "@/server/auth/permissions";
import { type Db, db } from "@/server/db/client";
import {
  attachments,
  auditLogs,
  collectorProfiles,
  disputes,
  notifications,
  pickupItems,
  type pickupRequestStatusEnum,
  pickupRequests,
  pointsLedger,
  profiles,
  redemptionRequests,
  rewards,
  supportTickets,
  verificationRecords,
} from "@/server/db/schema";

type PickupStatus = (typeof pickupRequestStatusEnum.enumValues)[number];
type VerificationDecision = "verified" | "rejected";
type Transaction = Parameters<Parameters<NonNullable<Db>["transaction"]>[0]>[0];
interface LockedPickupRequest {
  id: string;
  requester_profile_id: string;
  status: PickupStatus;
}
type PickupReviewItem = typeof pickupItems.$inferSelect;
type NotificationInsert = typeof notifications.$inferInsert;
interface PickupAssignmentTarget {
  collectorId: string;
  collectorProfileId: string;
}

function requireDb() {
  if (!db) {
    throw new Error("Database is not configured.");
  }

  return db;
}

async function createNotificationEntry(
  database: NonNullable<Db>,
  input: NotificationInsert
) {
  await database.insert(notifications).values(input);
}

async function createPickupCreationNotifications(
  tx: Transaction,
  profileId: string,
  requestId: string,
  collector: PickupAssignmentTarget | undefined
) {
  await tx.insert(notifications).values({
    profileId,
    type: "pickup_update",
    title: "Pickup request created",
    body: collector
      ? "Your pickup has been created and assigned to an available collector."
      : "Your pickup has been created and is waiting for collector assignment.",
    data: {
      pickupRequestId: requestId,
      status: collector ? "assigned" : "requested",
    },
  });

  if (collector?.collectorProfileId) {
    await tx.insert(notifications).values({
      profileId: collector.collectorProfileId,
      type: "pickup_update",
      title: "New pickup assigned",
      body: "A new city-matched pickup is waiting for you in your collector queue.",
      data: {
        pickupRequestId: requestId,
        status: "assigned",
      },
    });
  }
}

async function getOpsKpis(database: NonNullable<Db>) {
  const [pickupSummary] = await database
    .select({
      totalPickups: sql<number>`count(*)`,
      completedPickups: sql<number>`count(*) filter (where ${pickupRequests.status} in ('verified', 'completed'))`,
      assignedPickups: sql<number>`count(*) filter (where ${pickupRequests.status} in ('assigned', 'accepted', 'en_route', 'collected', 'verified', 'completed'))`,
      acceptedPickups: sql<number>`count(*) filter (where ${pickupRequests.status} in ('accepted', 'en_route', 'collected', 'verified', 'completed'))`,
    })
    .from(pickupRequests);

  const verificationTurnaroundResult = await database.execute(sql<{
    average_hours: string | number | null;
  }>`
    select round(avg(extract(epoch from (vr.created_at - pr.collected_at)) / 3600)::numeric, 1) as average_hours
    from ${verificationRecords} vr
    inner join ${pickupRequests} pr on pr.id = vr.pickup_request_id
    where vr.status = 'verified' and pr.collected_at is not null
  `);
  const verificationTurnaround = verificationTurnaroundResult.rows[0] as
    | {
        average_hours: string | number | null;
      }
    | undefined;

  const [redemptionSummary] = await database
    .select({
      totalRedemptions: sql<number>`count(*)`,
      fulfilledRedemptions: sql<number>`count(*) filter (where ${redemptionRequests.status} = 'fulfilled')`,
    })
    .from(redemptionRequests);

  const [supportSummary] = await database
    .select({
      openTickets: sql<number>`count(*)`,
    })
    .from(supportTickets)
    .where(inArray(supportTickets.status, ["open", "in_review", "escalated"]));

  const [disputeSummary] = await database
    .select({
      openDisputes: sql<number>`count(*)`,
    })
    .from(disputes)
    .where(inArray(disputes.status, ["open", "in_review", "escalated"]));

  const totalPickups = Number(pickupSummary?.totalPickups ?? 0);
  const assignedPickups = Number(pickupSummary?.assignedPickups ?? 0);
  const totalRedemptions = Number(redemptionSummary?.totalRedemptions ?? 0);

  return {
    pickupCompletionRate:
      totalPickups > 0
        ? Math.round(
            (Number(pickupSummary?.completedPickups ?? 0) / totalPickups) * 100
          )
        : 0,
    collectorAcceptanceRate:
      assignedPickups > 0
        ? Math.round(
            (Number(pickupSummary?.acceptedPickups ?? 0) / assignedPickups) *
              100
          )
        : 0,
    verificationTurnaroundHours: Number(
      verificationTurnaround?.average_hours ?? 0
    ),
    redemptionCompletionRate:
      totalRedemptions > 0
        ? Math.round(
            (Number(redemptionSummary?.fulfilledRedemptions ?? 0) /
              totalRedemptions) *
              100
          )
        : 0,
    openCaseCount:
      Number(supportSummary?.openTickets ?? 0) +
      Number(disputeSummary?.openDisputes ?? 0),
  };
}

function normalizeRole(value: FormDataEntryValue | null): AppRole {
  const role = String(value ?? "").trim() as AppRole;

  if (!appRoles.includes(role)) {
    return "user";
  }

  return role;
}

function normalizeOnboardingRole(
  value: FormDataEntryValue | null
): "user" | "collector" {
  const role = String(value ?? "").trim();

  return role === "collector" ? "collector" : "user";
}

function normalizePickupStatus(value: FormDataEntryValue | null): PickupStatus {
  const allowed: PickupStatus[] = [
    "accepted",
    "en_route",
    "collected",
    "completed",
    "cancelled",
  ];
  const status = String(value ?? "").trim() as PickupStatus;

  if (!allowed.includes(status)) {
    throw new Error("Invalid pickup status.");
  }

  return status;
}

function canTransitionPickupStatus(
  currentStatus: PickupStatus,
  nextStatus: PickupStatus
) {
  const allowedTransitions: Record<PickupStatus, PickupStatus[]> = {
    draft: [],
    requested: [],
    assigned: [],
    accepted: ["accepted", "en_route", "cancelled"],
    en_route: ["en_route", "collected", "cancelled"],
    collected: ["collected", "completed", "cancelled"],
    verified: [],
    rejected: [],
    completed: [],
    cancelled: [],
  };

  return allowedTransitions[currentStatus]?.includes(nextStatus) ?? false;
}

function normalizeVerificationDecision(
  value: FormDataEntryValue | null
): VerificationDecision {
  return String(value ?? "").trim() === "verified" ? "verified" : "rejected";
}

function assertPickupReadyForVerification(
  request: LockedPickupRequest | undefined
): LockedPickupRequest {
  if (!request) {
    throw new Error("Pickup request not found.");
  }

  if (["verified", "rejected"].includes(request.status)) {
    throw new Error("Pickup request has already been reviewed.");
  }

  if (!["collected", "completed"].includes(request.status)) {
    throw new Error("Pickup request is not ready for verification.");
  }

  return request;
}

async function applyVerifiedPickupReview(
  tx: Transaction,
  request: LockedPickupRequest,
  reviewerId: string,
  items: PickupReviewItem[],
  pointsValue: number,
  reason: string
) {
  await tx
    .update(pickupRequests)
    .set({
      status: "verified",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(pickupRequests.id, request.id));

  for (const item of items) {
    const awardedPoints =
      pointsValue > 0 ? pointsValue : Math.max(item.quantity ?? 1, 1) * 10;

    await tx
      .update(pickupItems)
      .set({
        verificationStatus: "verified",
        pointsAwarded: awardedPoints,
        updatedAt: new Date(),
      })
      .where(eq(pickupItems.id, item.id));

    await tx.insert(verificationRecords).values({
      pickupRequestId: request.id,
      pickupItemId: item.id,
      reviewerProfileId: reviewerId,
      status: "verified",
      reason: reason || null,
      verifiedPoints: awardedPoints,
    });

    await tx.insert(pointsLedger).values({
      profileId: request.requester_profile_id,
      pickupRequestId: request.id,
      pickupItemId: item.id,
      direction: "credit",
      points: awardedPoints,
      reason: `Verified recycling: ${item.wasteType}`,
    });
  }

  await tx.insert(notifications).values({
    profileId: request.requester_profile_id,
    type: "verification",
    title: "Pickup verified",
    body: "Your latest recycling pickup has been verified and points were added to your balance.",
  });
}

async function applyRejectedPickupReview(
  tx: Transaction,
  request: LockedPickupRequest,
  reviewerId: string,
  items: PickupReviewItem[],
  reason: string
) {
  await tx
    .update(pickupRequests)
    .set({
      status: "rejected",
      updatedAt: new Date(),
    })
    .where(eq(pickupRequests.id, request.id));

  for (const item of items) {
    await tx
      .update(pickupItems)
      .set({
        verificationStatus: "rejected",
        updatedAt: new Date(),
      })
      .where(eq(pickupItems.id, item.id));

    await tx.insert(verificationRecords).values({
      pickupRequestId: request.id,
      pickupItemId: item.id,
      reviewerProfileId: reviewerId,
      status: "rejected",
      reason: reason || "Rejected during verification",
      verifiedPoints: 0,
    });
  }

  await tx.insert(notifications).values({
    profileId: request.requester_profile_id,
    type: "verification",
    title: "Pickup rejected",
    body: reason || "Your latest recycling pickup did not pass verification.",
  });
}

export async function saveOnboarding(formData: FormData) {
  const database = requireDb();
  const profile = await requireProfile();

  const role = normalizeOnboardingRole(formData.get("role"));
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
  const city = String(formData.get("city") ?? "Lagos").trim() || "Lagos";
  const vehicleType = String(formData.get("vehicleType") ?? "").trim();
  const coverageRadiusKm = Number(formData.get("coverageRadiusKm") ?? 10);

  if (!fullName) {
    throw new Error("Full name is required.");
  }

  await database.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({
        fullName,
        phoneNumber: phoneNumber || null,
        city,
        role,
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profile.id));

    if (role === "collector") {
      const [existingCollector] = await tx
        .select()
        .from(collectorProfiles)
        .where(eq(collectorProfiles.profileId, profile.id))
        .limit(1);

      if (existingCollector) {
        await tx
          .update(collectorProfiles)
          .set({
            vehicleType: vehicleType || existingCollector.vehicleType,
            coverageRadiusKm: String(
              Number.isFinite(coverageRadiusKm) ? coverageRadiusKm : 10
            ),
            updatedAt: new Date(),
          })
          .where(eq(collectorProfiles.profileId, profile.id));
      } else {
        await tx.insert(collectorProfiles).values({
          profileId: profile.id,
          vehicleType: vehicleType || null,
          coverageRadiusKm: String(
            Number.isFinite(coverageRadiusKm) ? coverageRadiusKm : 10
          ),
        });
      }
    }
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createPickupRequest(formData: FormData) {
  const database = requireDb();
  const profile = await requireRole("user");

  const wasteType = String(formData.get("wasteType") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 1);
  const estimatedWeightKg = Number(formData.get("estimatedWeightKg") ?? 0);
  const addressLine1 = String(formData.get("addressLine1") ?? "").trim();
  const addressLine2 = String(formData.get("addressLine2") ?? "").trim();
  const city =
    String(formData.get("city") ?? profile.city ?? "Lagos").trim() || "Lagos";
  const state = String(formData.get("state") ?? "Lagos").trim() || "Lagos";
  const pickupWindowLabel = String(
    formData.get("pickupWindowLabel") ?? ""
  ).trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const scheduledForRaw = String(formData.get("scheduledFor") ?? "").trim();

  if (!(wasteType && addressLine1 && pickupWindowLabel && scheduledForRaw)) {
    throw new Error(
      "Waste type, address, pickup window, and schedule are required."
    );
  }

  const scheduledFor = new Date(scheduledForRaw);

  if (Number.isNaN(scheduledFor.valueOf())) {
    throw new Error("Scheduled date is invalid.");
  }

  await database.transaction(async (tx) => {
    const [collector] = await tx
      .select({
        collectorId: collectorProfiles.id,
        collectorProfileId: collectorProfiles.profileId,
      })
      .from(collectorProfiles)
      .innerJoin(profiles, eq(collectorProfiles.profileId, profiles.id))
      .where(
        and(
          eq(profiles.role, "collector"),
          eq(profiles.isActive, true),
          eq(collectorProfiles.availability, "available"),
          eq(profiles.city, city)
        )
      )
      .orderBy(asc(collectorProfiles.updatedAt))
      .limit(1);

    const [request] = await tx
      .insert(pickupRequests)
      .values({
        requesterProfileId: profile.id,
        assignedCollectorProfileId: collector?.collectorId ?? null,
        status: collector ? "assigned" : "requested",
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        pickupWindowLabel,
        scheduledFor,
        estimatedWeightKg:
          estimatedWeightKg > 0 ? String(estimatedWeightKg.toFixed(2)) : null,
        notes: notes || null,
        assignedAt: collector ? new Date() : null,
      })
      .returning({ id: pickupRequests.id });

    await tx.insert(pickupItems).values({
      pickupRequestId: request.id,
      wasteType: wasteType as typeof pickupItems.$inferInsert.wasteType,
      quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      estimatedWeightKg:
        estimatedWeightKg > 0 ? String(estimatedWeightKg.toFixed(2)) : null,
      notes: notes || null,
    });

    await createPickupCreationNotifications(
      tx,
      profile.id,
      request.id,
      collector as PickupAssignmentTarget | undefined
    );
  });

  revalidatePath("/dashboard");
}

export async function createRedemptionRequest(formData: FormData) {
  const database = requireDb();
  const profile = await requireRole("user");

  const rewardId = String(formData.get("rewardId") ?? "").trim();
  const payoutMethod =
    String(formData.get("payoutMethod") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim();

  const [reward] = await database
    .select()
    .from(rewards)
    .where(eq(rewards.id, rewardId))
    .limit(1);

  if (!reward?.isActive) {
    throw new Error("Reward is not available.");
  }

  await database.transaction(async (tx) => {
    await tx.execute(
      sql`select ${profiles.id} from ${profiles} where ${profiles.id} = ${profile.id} for update`
    );

    const [balanceResult] = await tx
      .select({
        balance: sql<number>`coalesce(sum(case when ${pointsLedger.direction} = 'credit' then ${pointsLedger.points} else -${pointsLedger.points} end), 0)`,
      })
      .from(pointsLedger)
      .where(eq(pointsLedger.profileId, profile.id));

    const currentBalance = Number(balanceResult?.balance ?? 0);
    if (currentBalance < reward.pointsCost) {
      throw new Error("Not enough points for this redemption.");
    }

    const [redemption] = await tx
      .insert(redemptionRequests)
      .values({
        requesterProfileId: profile.id,
        rewardId: reward.id,
        status: "pending",
        pointsSpent: reward.pointsCost,
        payoutMethod,
        notes: notes || null,
      })
      .returning({ id: redemptionRequests.id });

    await tx.insert(pointsLedger).values({
      profileId: profile.id,
      redemptionRequestId: redemption.id,
      direction: "debit",
      points: reward.pointsCost,
      reason: `Hold for redemption: ${reward.title}`,
    });

    await tx.insert(notifications).values({
      profileId: profile.id,
      type: "reward",
      title: "Redemption request submitted",
      body: `Your request for ${reward.title} is now pending review.`,
      data: {
        rewardId: reward.id,
        redemptionStatus: "pending",
      },
    });
  });

  revalidatePath("/dashboard");
}

export async function createSupportTicket(formData: FormData) {
  const database = requireDb();
  const profile = await requireProfile();

  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const pickupRequestId =
    String(formData.get("pickupRequestId") ?? "").trim() || null;
  const priority = String(formData.get("priority") ?? "medium").trim();

  if (!(subject && message)) {
    throw new Error("Support subject and message are required.");
  }

  await database.insert(supportTickets).values({
    requesterProfileId: profile.id,
    pickupRequestId,
    subject,
    message,
    priority:
      priority === "low" || priority === "high" || priority === "urgent"
        ? priority
        : "medium",
  });

  await createNotificationEntry(database, {
    profileId: profile.id,
    type: "support",
    title: "Support ticket received",
    body: "Your support request has been logged and is now visible to staff.",
    data: {
      pickupRequestId,
      supportStatus: "open",
    },
  });

  revalidatePath("/dashboard");
}

export async function createDispute(formData: FormData) {
  const database = requireDb();
  const profile = await requireProfile();

  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const pickupRequestId =
    String(formData.get("pickupRequestId") ?? "").trim() || null;

  if (!(category && description)) {
    throw new Error("Dispute category and description are required.");
  }

  await database.insert(disputes).values({
    requesterProfileId: profile.id,
    pickupRequestId,
    category,
    description,
  });

  await createNotificationEntry(database, {
    profileId: profile.id,
    type: "support",
    title: "Dispute opened",
    body: "Your dispute has been submitted for review.",
    data: {
      pickupRequestId,
      disputeStatus: "open",
    },
  });

  revalidatePath("/dashboard");
}

export async function updateCollectorAvailability(formData: FormData) {
  const database = requireDb();
  const profile = await requireRole("collector");

  const availability = String(formData.get("availability") ?? "").trim();
  const vehicleType = String(formData.get("vehicleType") ?? "").trim();
  const coverageRadiusKm = Number(formData.get("coverageRadiusKm") ?? 10);

  if (!["offline", "available", "busy"].includes(availability)) {
    throw new Error("Invalid collector availability.");
  }

  await database
    .update(collectorProfiles)
    .set({
      availability:
        availability as typeof collectorProfiles.$inferInsert.availability,
      vehicleType: vehicleType || null,
      coverageRadiusKm: String(
        Number.isFinite(coverageRadiusKm) ? coverageRadiusKm : 10
      ),
      updatedAt: new Date(),
    })
    .where(eq(collectorProfiles.profileId, profile.id));

  revalidatePath("/dashboard");
}

export async function acceptAssignedPickup(formData: FormData) {
  const database = requireDb();
  const profile = await requireRole("collector");
  const pickupRequestId = String(formData.get("pickupRequestId") ?? "");

  const [collectorProfile] = await database
    .select()
    .from(collectorProfiles)
    .where(eq(collectorProfiles.profileId, profile.id))
    .limit(1);

  if (!collectorProfile) {
    throw new Error("Collector profile is missing.");
  }

  const acceptedRequests = await database
    .update(pickupRequests)
    .set({
      status: "accepted",
      acceptedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(pickupRequests.id, pickupRequestId),
        eq(pickupRequests.assignedCollectorProfileId, collectorProfile.id),
        eq(pickupRequests.status, "assigned")
      )
    )
    .returning({ id: pickupRequests.id });

  if (acceptedRequests.length) {
    await database
      .update(collectorProfiles)
      .set({
        availability: "busy",
        updatedAt: new Date(),
      })
      .where(eq(collectorProfiles.id, collectorProfile.id));

    const [acceptedRequest] = await database
      .select({
        requesterProfileId: pickupRequests.requesterProfileId,
      })
      .from(pickupRequests)
      .where(eq(pickupRequests.id, pickupRequestId))
      .limit(1);

    if (acceptedRequest) {
      await createNotificationEntry(database, {
        profileId: acceptedRequest.requesterProfileId,
        type: "pickup_update",
        title: "Collector accepted your pickup",
        body: "Your assigned collector has accepted the job and will move it through the next status steps.",
        data: {
          pickupRequestId,
          status: "accepted",
        },
      });
    }
  }

  revalidatePath("/dashboard");
}

export async function updatePickupStatus(formData: FormData) {
  const database = requireDb();
  const profile = await requireRole("collector");
  const pickupRequestId = String(formData.get("pickupRequestId") ?? "");
  const nextStatus = normalizePickupStatus(formData.get("status"));

  const [collectorProfile] = await database
    .select()
    .from(collectorProfiles)
    .where(eq(collectorProfiles.profileId, profile.id))
    .limit(1);

  if (!collectorProfile) {
    throw new Error("Collector profile is missing.");
  }

  const [request] = await database
    .select({
      id: pickupRequests.id,
      requesterProfileId: pickupRequests.requesterProfileId,
      status: pickupRequests.status,
    })
    .from(pickupRequests)
    .where(
      and(
        eq(pickupRequests.id, pickupRequestId),
        eq(pickupRequests.assignedCollectorProfileId, collectorProfile.id)
      )
    )
    .limit(1);

  if (!request) {
    throw new Error("Pickup request was not found.");
  }

  if (!canTransitionPickupStatus(request.status, nextStatus)) {
    throw new Error("Invalid pickup status transition.");
  }

  const nextValues: Partial<typeof pickupRequests.$inferInsert> = {
    status: nextStatus,
    updatedAt: new Date(),
  };

  if (nextStatus === "en_route") {
    nextValues.acceptedAt = new Date();
  }

  if (nextStatus === "collected") {
    nextValues.collectedAt = new Date();
  }

  if (nextStatus === "completed") {
    nextValues.completedAt = new Date();
  }

  if (nextStatus === "cancelled") {
    nextValues.cancelledAt = new Date();
  }

  await database
    .update(pickupRequests)
    .set(nextValues)
    .where(
      and(
        eq(pickupRequests.id, pickupRequestId),
        eq(pickupRequests.assignedCollectorProfileId, collectorProfile.id),
        eq(pickupRequests.status, request.status)
      )
    );

  await createNotificationEntry(database, {
    profileId: request.requesterProfileId,
    type: "pickup_update",
    title: "Pickup status updated",
    body: `Your pickup is now marked as ${nextStatus.replaceAll("_", " ")}.`,
    data: {
      pickupRequestId,
      status: nextStatus,
    },
  });

  if (["completed", "cancelled"].includes(nextStatus)) {
    await database
      .update(collectorProfiles)
      .set({
        availability: "available",
        updatedAt: new Date(),
      })
      .where(eq(collectorProfiles.id, collectorProfile.id));
  }

  revalidatePath("/dashboard");
}

export async function savePickupProof(input: {
  pickupRequestId: string;
  fileKey: string;
  fileUrl: string;
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
}) {
  const database = requireDb();
  const profile = await requireRole("collector");

  const [collectorProfile] = await database
    .select()
    .from(collectorProfiles)
    .where(eq(collectorProfiles.profileId, profile.id))
    .limit(1);

  if (!collectorProfile) {
    throw new Error("Collector profile is missing.");
  }

  const [request] = await database
    .select({
      id: pickupRequests.id,
      status: pickupRequests.status,
      requesterProfileId: pickupRequests.requesterProfileId,
    })
    .from(pickupRequests)
    .where(
      and(
        eq(pickupRequests.id, input.pickupRequestId),
        eq(pickupRequests.assignedCollectorProfileId, collectorProfile.id)
      )
    )
    .limit(1);

  if (!request) {
    throw new Error("Pickup request was not found.");
  }

  const [pickupItem] = await database
    .select()
    .from(pickupItems)
    .where(eq(pickupItems.pickupRequestId, request.id))
    .limit(1);

  await database.insert(attachments).values({
    ownerProfileId: profile.id,
    pickupRequestId: request.id,
    pickupItemId: pickupItem?.id ?? null,
    kind: "pickup_proof",
    fileKey: input.fileKey,
    fileUrl: input.fileUrl,
    fileName: input.fileName ?? null,
    fileSize: input.fileSize ?? null,
    mimeType: input.mimeType ?? null,
  });

  if (request.status === "accepted" || request.status === "en_route") {
    await database
      .update(pickupRequests)
      .set({
        status: "collected",
        collectedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(pickupRequests.id, request.id));
  }

  await createNotificationEntry(database, {
    profileId: request.requesterProfileId,
    type: "pickup_update",
    title: "Collection proof uploaded",
    body: "Your collector has uploaded proof, and the request is moving into review.",
    data: {
      pickupRequestId: request.id,
      status:
        request.status === "accepted" || request.status === "en_route"
          ? "collected"
          : request.status,
    },
  });

  revalidatePath("/dashboard");
}

export async function verifyPickupRequest(formData: FormData) {
  const database = requireDb();
  const reviewer = await requireRole(["staff", "super_admin"]);
  const pickupRequestId = String(formData.get("pickupRequestId") ?? "").trim();
  const decision = normalizeVerificationDecision(formData.get("decision"));
  const reason = String(formData.get("reason") ?? "").trim();
  const pointsValue = Number(formData.get("pointsValue") ?? 0);

  await database.transaction(async (tx) => {
    const lockedRequestResult = await tx.execute(
      sql`select id, requester_profile_id, status from ${pickupRequests} where ${pickupRequests.id} = ${pickupRequestId} for update`
    );

    const lockedRequest = assertPickupReadyForVerification(
      lockedRequestResult.rows[0] as unknown as LockedPickupRequest | undefined
    );

    const items = await tx
      .select()
      .from(pickupItems)
      .where(eq(pickupItems.pickupRequestId, lockedRequest.id));

    if (!items.length) {
      throw new Error("Pickup request has no items to verify.");
    }

    if (decision === "verified") {
      await applyVerifiedPickupReview(
        tx,
        lockedRequest,
        reviewer.id,
        items,
        pointsValue,
        reason
      );
    } else {
      await applyRejectedPickupReview(
        tx,
        lockedRequest,
        reviewer.id,
        items,
        reason
      );
    }

    await tx.insert(auditLogs).values({
      actorProfileId: reviewer.id,
      entityType: "pickup_request",
      entityId: lockedRequest.id,
      action: decision === "verified" ? "verify_pickup" : "reject_pickup",
      details: {
        reason: reason || null,
      },
    });
  });

  revalidatePath("/dashboard");
}

export async function reviewRedemptionRequest(formData: FormData) {
  const database = requireDb();
  const reviewer = await requireRole(["staff", "super_admin"]);
  const redemptionRequestId = String(
    formData.get("redemptionRequestId") ?? ""
  ).trim();
  const decision = String(formData.get("decision") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  const [request] = await database
    .select()
    .from(redemptionRequests)
    .where(eq(redemptionRequests.id, redemptionRequestId))
    .limit(1);

  if (!request) {
    throw new Error("Redemption request not found.");
  }

  await database.transaction(async (tx) => {
    let redemptionBody = "Your redemption request was rejected.";

    if (decision === "approved") {
      await tx
        .update(redemptionRequests)
        .set({
          status: "approved",
          reviewedByProfileId: reviewer.id,
          reviewedAt: new Date(),
          rejectionReason: null,
          updatedAt: new Date(),
        })
        .where(eq(redemptionRequests.id, request.id));
      redemptionBody =
        "Your redemption request was approved and is waiting for fulfillment.";
    } else if (decision === "fulfilled") {
      await tx
        .update(redemptionRequests)
        .set({
          status: "fulfilled",
          reviewedByProfileId: reviewer.id,
          reviewedAt: new Date(),
          fulfilledAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(redemptionRequests.id, request.id));
      redemptionBody = "Your redemption request has been fulfilled.";
    } else {
      await tx
        .update(redemptionRequests)
        .set({
          status: "rejected",
          reviewedByProfileId: reviewer.id,
          reviewedAt: new Date(),
          rejectionReason: reason || "Rejected by staff",
          updatedAt: new Date(),
        })
        .where(eq(redemptionRequests.id, request.id));

      await tx.insert(pointsLedger).values({
        profileId: request.requesterProfileId,
        redemptionRequestId: request.id,
        direction: "credit",
        points: request.pointsSpent,
        reason: `Refund for rejected redemption ${request.id}`,
      });

      if (reason) {
        redemptionBody = reason;
      }
    }

    await tx.insert(notifications).values({
      profileId: request.requesterProfileId,
      type: "reward",
      title: `Redemption ${decision}`,
      body: redemptionBody,
      data: {
        redemptionRequestId: request.id,
        status: decision,
      },
    });

    await tx.insert(auditLogs).values({
      actorProfileId: reviewer.id,
      entityType: "redemption_request",
      entityId: request.id,
      action: `redemption_${decision}`,
      details: {
        reason: reason || null,
      },
    });
  });

  revalidatePath("/dashboard");
}

export async function updateSupportTicketStatus(formData: FormData) {
  const database = requireDb();
  const reviewer = await requireRole(["staff", "super_admin"]);
  const ticketId = String(formData.get("ticketId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (
    !["open", "in_review", "escalated", "resolved", "closed"].includes(status)
  ) {
    throw new Error("Invalid support status.");
  }

  await database
    .update(supportTickets)
    .set({
      status: status as typeof supportTickets.$inferInsert.status,
      assignedToProfileId: reviewer.id,
      closedAt:
        status === "resolved" || status === "closed" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(supportTickets.id, ticketId));

  const [ticket] = await database
    .select({
      requesterProfileId: supportTickets.requesterProfileId,
      subject: supportTickets.subject,
    })
    .from(supportTickets)
    .where(eq(supportTickets.id, ticketId))
    .limit(1);

  if (ticket) {
    await createNotificationEntry(database, {
      profileId: ticket.requesterProfileId,
      type: "support",
      title: "Support ticket updated",
      body: `${ticket.subject} is now marked as ${status.replaceAll("_", " ")}.`,
      data: {
        ticketId,
        status,
      },
    });
  }

  revalidatePath("/dashboard");
}

export async function updateDisputeStatus(formData: FormData) {
  const database = requireDb();
  const reviewer = await requireRole(["staff", "super_admin"]);
  const disputeId = String(formData.get("disputeId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const resolution = String(formData.get("resolution") ?? "").trim();

  if (
    !["open", "in_review", "escalated", "resolved", "closed"].includes(status)
  ) {
    throw new Error("Invalid dispute status.");
  }

  await database
    .update(disputes)
    .set({
      status: status as typeof disputes.$inferInsert.status,
      assignedToProfileId: reviewer.id,
      escalatedToProfileId: status === "escalated" ? reviewer.id : null,
      resolution: resolution || null,
      resolvedAt:
        status === "resolved" || status === "closed" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(disputes.id, disputeId));

  const [dispute] = await database
    .select({
      requesterProfileId: disputes.requesterProfileId,
      category: disputes.category,
    })
    .from(disputes)
    .where(eq(disputes.id, disputeId))
    .limit(1);

  if (dispute) {
    await createNotificationEntry(database, {
      profileId: dispute.requesterProfileId,
      type: "support",
      title: "Dispute updated",
      body:
        resolution ||
        `${dispute.category} is now marked as ${status.replaceAll("_", " ")}.`,
      data: {
        disputeId,
        status,
      },
    });
  }

  revalidatePath("/dashboard");
}

export async function createReward(formData: FormData) {
  const database = requireDb();
  await requireRole("super_admin");

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const pointsCost = Number(formData.get("pointsCost") ?? 0);
  const cashValueMinor = Number(formData.get("cashValueMinor") ?? 0);

  if (!(title && slug) || pointsCost <= 0) {
    throw new Error("Reward title, slug, and points cost are required.");
  }

  await database.insert(rewards).values({
    title,
    slug,
    description: description || null,
    type: type === "voucher" || type === "partner_reward" ? type : "cashout",
    pointsCost,
    cashValueMinor: cashValueMinor > 0 ? cashValueMinor : null,
  });

  revalidatePath("/dashboard");
}

export async function updateProfileRole(formData: FormData) {
  const database = requireDb();
  await requireRole("super_admin");

  const profileId = String(formData.get("profileId") ?? "").trim();
  const role = normalizeRole(formData.get("role"));

  await database
    .update(profiles)
    .set({
      role,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, profileId));

  revalidatePath("/dashboard");
}

export async function getUserPickupHistory(profileId: string) {
  const database = requireDb();

  return await database
    .select({
      id: pickupRequests.id,
      status: pickupRequests.status,
      city: pickupRequests.city,
      addressLine1: pickupRequests.addressLine1,
      pickupWindowLabel: pickupRequests.pickupWindowLabel,
      scheduledFor: pickupRequests.scheduledFor,
      createdAt: pickupRequests.createdAt,
      wasteType: pickupItems.wasteType,
      quantity: pickupItems.quantity,
      estimatedWeightKg: pickupItems.estimatedWeightKg,
    })
    .from(pickupRequests)
    .leftJoin(pickupItems, eq(pickupItems.pickupRequestId, pickupRequests.id))
    .where(eq(pickupRequests.requesterProfileId, profileId))
    .orderBy(desc(pickupRequests.createdAt));
}

export async function getUserRewardsAndSupport(profileId: string) {
  const database = requireDb();

  const [balanceResult] = await database
    .select({
      balance: sql<number>`coalesce(sum(case when ${pointsLedger.direction} = 'credit' then ${pointsLedger.points} else -${pointsLedger.points} end), 0)`,
    })
    .from(pointsLedger)
    .where(eq(pointsLedger.profileId, profileId));

  const rewardCatalog = await database
    .select()
    .from(rewards)
    .where(eq(rewards.isActive, true))
    .orderBy(asc(rewards.pointsCost));

  const redemptions = await database
    .select({
      id: redemptionRequests.id,
      status: redemptionRequests.status,
      pointsSpent: redemptionRequests.pointsSpent,
      rewardTitle: rewards.title,
      createdAt: redemptionRequests.createdAt,
      rejectionReason: redemptionRequests.rejectionReason,
    })
    .from(redemptionRequests)
    .leftJoin(rewards, eq(rewards.id, redemptionRequests.rewardId))
    .where(eq(redemptionRequests.requesterProfileId, profileId))
    .orderBy(desc(redemptionRequests.createdAt));

  const tickets = await database
    .select({
      id: supportTickets.id,
      subject: supportTickets.subject,
      status: supportTickets.status,
      priority: supportTickets.priority,
      createdAt: supportTickets.createdAt,
    })
    .from(supportTickets)
    .where(eq(supportTickets.requesterProfileId, profileId))
    .orderBy(desc(supportTickets.createdAt));

  const userDisputes = await database
    .select({
      id: disputes.id,
      category: disputes.category,
      status: disputes.status,
      createdAt: disputes.createdAt,
      resolution: disputes.resolution,
    })
    .from(disputes)
    .where(eq(disputes.requesterProfileId, profileId))
    .orderBy(desc(disputes.createdAt));

  return {
    pointsBalance: Number(balanceResult?.balance ?? 0),
    rewardCatalog,
    redemptions,
    tickets,
    userDisputes,
  };
}

export async function getRecentNotifications(profileId: string) {
  const database = requireDb();

  const [unreadSummary] = await database
    .select({
      unreadCount: sql<number>`count(*) filter (where ${notifications.readAt} is null)`,
    })
    .from(notifications)
    .where(eq(notifications.profileId, profileId));

  const items = await database
    .select({
      id: notifications.id,
      type: notifications.type,
      title: notifications.title,
      body: notifications.body,
      createdAt: notifications.createdAt,
      readAt: notifications.readAt,
    })
    .from(notifications)
    .where(eq(notifications.profileId, profileId))
    .orderBy(desc(notifications.createdAt))
    .limit(6);

  return {
    unreadCount: Number(unreadSummary?.unreadCount ?? 0),
    items,
  };
}

export async function getCollectorDashboardData(profileId: string) {
  const database = requireDb();

  const [collectorProfile] = await database
    .select()
    .from(collectorProfiles)
    .where(eq(collectorProfiles.profileId, profileId))
    .limit(1);

  if (!collectorProfile) {
    return {
      collectorProfile: null,
      assignedRequests: [],
    };
  }

  const assignedRequests = await database
    .select({
      id: pickupRequests.id,
      status: pickupRequests.status,
      city: pickupRequests.city,
      addressLine1: pickupRequests.addressLine1,
      pickupWindowLabel: pickupRequests.pickupWindowLabel,
      scheduledFor: pickupRequests.scheduledFor,
      createdAt: pickupRequests.createdAt,
      wasteType: pickupItems.wasteType,
      quantity: pickupItems.quantity,
      requesterName: profiles.fullName,
    })
    .from(pickupRequests)
    .innerJoin(profiles, eq(profiles.id, pickupRequests.requesterProfileId))
    .leftJoin(pickupItems, eq(pickupItems.pickupRequestId, pickupRequests.id))
    .where(eq(pickupRequests.assignedCollectorProfileId, collectorProfile.id))
    .orderBy(desc(pickupRequests.createdAt));
  return {
    collectorProfile,
    assignedRequests,
  };
}

export async function getStaffDashboardData() {
  const database = requireDb();
  await requireRole(["staff", "super_admin"]);

  const verificationQueue = await database
    .select({
      id: pickupRequests.id,
      requesterName: profiles.fullName,
      city: pickupRequests.city,
      status: pickupRequests.status,
      createdAt: pickupRequests.createdAt,
      wasteType: pickupItems.wasteType,
      quantity: pickupItems.quantity,
    })
    .from(pickupRequests)
    .innerJoin(profiles, eq(profiles.id, pickupRequests.requesterProfileId))
    .leftJoin(pickupItems, eq(pickupItems.pickupRequestId, pickupRequests.id))
    .where(inArray(pickupRequests.status, ["collected", "completed"]))
    .orderBy(desc(pickupRequests.updatedAt));

  const pendingRedemptions = await database
    .select({
      id: redemptionRequests.id,
      requesterName: profiles.fullName,
      status: redemptionRequests.status,
      pointsSpent: redemptionRequests.pointsSpent,
      rewardTitle: rewards.title,
      createdAt: redemptionRequests.createdAt,
    })
    .from(redemptionRequests)
    .innerJoin(profiles, eq(profiles.id, redemptionRequests.requesterProfileId))
    .leftJoin(rewards, eq(rewards.id, redemptionRequests.rewardId))
    .where(inArray(redemptionRequests.status, ["pending", "approved"]))
    .orderBy(desc(redemptionRequests.createdAt));

  const ticketQueue = await database
    .select()
    .from(supportTickets)
    .where(inArray(supportTickets.status, ["open", "in_review", "escalated"]))
    .orderBy(desc(supportTickets.createdAt));

  const disputeQueue = await database
    .select()
    .from(disputes)
    .where(inArray(disputes.status, ["open", "in_review", "escalated"]))
    .orderBy(desc(disputes.createdAt));

  const opsKpis = await getOpsKpis(database);

  return {
    opsKpis,
    verificationQueue,
    pendingRedemptions,
    ticketQueue,
    disputeQueue,
  };
}

export async function getSuperAdminDashboardData() {
  const database = requireDb();
  await requireRole("super_admin");

  const rewardList = await database
    .select()
    .from(rewards)
    .orderBy(desc(rewards.createdAt));
  const roleList = await database
    .select({
      id: profiles.id,
      fullName: profiles.fullName,
      email: profiles.email,
      role: profiles.role,
      city: profiles.city,
      onboardingCompleted: profiles.onboardingCompleted,
    })
    .from(profiles)
    .orderBy(asc(profiles.createdAt));

  const opsKpis = await getOpsKpis(database);

  return {
    rewardList,
    roleList,
    opsKpis,
  };
}
