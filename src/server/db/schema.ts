import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const appRoleEnum = pgEnum("app_role", [
  "user",
  "collector",
  "staff",
  "super_admin",
]);

export const wasteTypeEnum = pgEnum("waste_type", [
  "plastic",
  "paper",
  "glass",
  "metal",
  "electronic",
  "textile",
  "organic",
  "mixed",
]);

export const collectorAvailabilityEnum = pgEnum("collector_availability", [
  "offline",
  "available",
  "busy",
]);

export const pickupRequestStatusEnum = pgEnum("pickup_request_status", [
  "draft",
  "requested",
  "assigned",
  "accepted",
  "en_route",
  "collected",
  "verified",
  "rejected",
  "completed",
  "cancelled",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "verified",
  "rejected",
]);

export const redemptionStatusEnum = pgEnum("redemption_status", [
  "pending",
  "approved",
  "rejected",
  "fulfilled",
]);

export const supportStatusEnum = pgEnum("support_status", [
  "open",
  "in_review",
  "escalated",
  "resolved",
  "closed",
]);

export const ticketPriorityEnum = pgEnum("ticket_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const pointsDirectionEnum = pgEnum("points_direction", [
  "credit",
  "debit",
]);

export const rewardTypeEnum = pgEnum("reward_type", [
  "cashout",
  "voucher",
  "partner_reward",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "system",
  "pickup_update",
  "verification",
  "reward",
  "support",
]);

export const attachmentKindEnum = pgEnum("attachment_kind", [
  "pickup_proof",
  "support_attachment",
  "dispute_attachment",
  "avatar",
]);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email"),
    fullName: text("full_name"),
    phoneNumber: text("phone_number"),
    avatarUrl: text("avatar_url"),
    role: appRoleEnum("role").notNull().default("user"),
    isActive: boolean("is_active").notNull().default(true),
    onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
    city: text("city").default("Lagos"),
    metadata: jsonb("metadata").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("profiles_clerk_user_id_idx").on(table.clerkUserId),
    uniqueIndex("profiles_email_idx").on(table.email),
  ],
);

export const collectorProfiles = pgTable(
  "collector_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    availability: collectorAvailabilityEnum("availability")
      .notNull()
      .default("offline"),
    vehicleType: text("vehicle_type"),
    coverageRadiusKm: numeric("coverage_radius_km", {
      precision: 6,
      scale: 2,
    })
      .notNull()
      .default("10.00"),
    currentLatitude: numeric("current_latitude", {
      precision: 10,
      scale: 8,
    }),
    currentLongitude: numeric("current_longitude", {
      precision: 11,
      scale: 8,
    }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("collector_profiles_profile_id_idx").on(table.profileId),
    index("collector_profiles_availability_idx").on(table.availability),
  ],
);

export const pickupRequests = pgTable(
  "pickup_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requesterProfileId: uuid("requester_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    assignedCollectorProfileId: uuid("assigned_collector_profile_id").references(
      () => collectorProfiles.id,
      { onDelete: "set null" },
    ),
    status: pickupRequestStatusEnum("status").notNull().default("requested"),
    addressLine1: text("address_line_1").notNull(),
    addressLine2: text("address_line_2"),
    city: text("city").notNull().default("Lagos"),
    state: text("state").notNull().default("Lagos"),
    latitude: numeric("latitude", { precision: 10, scale: 8 }),
    longitude: numeric("longitude", { precision: 11, scale: 8 }),
    pickupWindowLabel: text("pickup_window_label"),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    estimatedWeightKg: numeric("estimated_weight_kg", {
      precision: 8,
      scale: 2,
    }),
    notes: text("notes"),
    assignedAt: timestamp("assigned_at", { withTimezone: true }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    collectedAt: timestamp("collected_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("pickup_requests_status_idx").on(table.status),
    index("pickup_requests_requester_idx").on(table.requesterProfileId),
    index("pickup_requests_collector_idx").on(table.assignedCollectorProfileId),
  ],
);

export const pickupItems = pgTable(
  "pickup_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pickupRequestId: uuid("pickup_request_id")
      .notNull()
      .references(() => pickupRequests.id, { onDelete: "cascade" }),
    wasteType: wasteTypeEnum("waste_type").notNull(),
    quantity: integer("quantity"),
    estimatedWeightKg: numeric("estimated_weight_kg", {
      precision: 8,
      scale: 2,
    }),
    actualWeightKg: numeric("actual_weight_kg", {
      precision: 8,
      scale: 2,
    }),
    notes: text("notes"),
    verificationStatus: verificationStatusEnum("verification_status")
      .notNull()
      .default("pending"),
    pointsAwarded: integer("points_awarded").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("pickup_items_request_idx").on(table.pickupRequestId),
    index("pickup_items_type_idx").on(table.wasteType),
  ],
);

export const verificationRecords = pgTable(
  "verification_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pickupRequestId: uuid("pickup_request_id")
      .notNull()
      .references(() => pickupRequests.id, { onDelete: "cascade" }),
    pickupItemId: uuid("pickup_item_id").references(() => pickupItems.id, {
      onDelete: "set null",
    }),
    reviewerProfileId: uuid("reviewer_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    status: verificationStatusEnum("status").notNull(),
    reason: text("reason"),
    verifiedPoints: integer("verified_points"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("verification_records_request_idx").on(table.pickupRequestId),
    index("verification_records_status_idx").on(table.status),
  ],
);

export const rewards = pgTable(
  "rewards",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    type: rewardTypeEnum("type").notNull(),
    pointsCost: integer("points_cost").notNull(),
    cashValueMinor: integer("cash_value_minor"),
    isActive: boolean("is_active").notNull().default(true),
    stock: integer("stock"),
    metadata: jsonb("metadata").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("rewards_slug_idx").on(table.slug),
    index("rewards_active_idx").on(table.isActive),
  ],
);

export const redemptionRequests = pgTable(
  "redemption_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requesterProfileId: uuid("requester_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    rewardId: uuid("reward_id").references(() => rewards.id, {
      onDelete: "set null",
    }),
    status: redemptionStatusEnum("status").notNull().default("pending"),
    pointsSpent: integer("points_spent").notNull(),
    payoutMethod: text("payout_method"),
    payoutDestination: jsonb("payout_destination").$type<Record<string, unknown> | null>(),
    notes: text("notes"),
    rejectionReason: text("rejection_reason"),
    reviewedByProfileId: uuid("reviewed_by_profile_id").references(
      () => profiles.id,
      { onDelete: "set null" },
    ),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    fulfilledAt: timestamp("fulfilled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("redemption_requests_requester_idx").on(table.requesterProfileId),
    index("redemption_requests_status_idx").on(table.status),
  ],
);

export const pointsLedger = pgTable(
  "points_ledger",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    pickupRequestId: uuid("pickup_request_id").references(() => pickupRequests.id, {
      onDelete: "set null",
    }),
    pickupItemId: uuid("pickup_item_id").references(() => pickupItems.id, {
      onDelete: "set null",
    }),
    redemptionRequestId: uuid("redemption_request_id").references(
      () => redemptionRequests.id,
      { onDelete: "set null" },
    ),
    direction: pointsDirectionEnum("direction").notNull(),
    points: integer("points").notNull(),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("points_ledger_profile_idx").on(table.profileId),
    index("points_ledger_request_idx").on(table.pickupRequestId),
  ],
);

export const supportTickets = pgTable(
  "support_tickets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requesterProfileId: uuid("requester_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    pickupRequestId: uuid("pickup_request_id").references(() => pickupRequests.id, {
      onDelete: "set null",
    }),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: supportStatusEnum("status").notNull().default("open"),
    priority: ticketPriorityEnum("priority").notNull().default("medium"),
    assignedToProfileId: uuid("assigned_to_profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("support_tickets_status_idx").on(table.status),
    index("support_tickets_requester_idx").on(table.requesterProfileId),
  ],
);

export const disputes = pgTable(
  "disputes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requesterProfileId: uuid("requester_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    pickupRequestId: uuid("pickup_request_id").references(() => pickupRequests.id, {
      onDelete: "set null",
    }),
    supportTicketId: uuid("support_ticket_id").references(() => supportTickets.id, {
      onDelete: "set null",
    }),
    status: supportStatusEnum("status").notNull().default("open"),
    category: text("category").notNull(),
    description: text("description").notNull(),
    resolution: text("resolution"),
    assignedToProfileId: uuid("assigned_to_profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    escalatedToProfileId: uuid("escalated_to_profile_id").references(
      () => profiles.id,
      { onDelete: "set null" },
    ),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("disputes_status_idx").on(table.status),
    index("disputes_requester_idx").on(table.requesterProfileId),
  ],
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull().default("system"),
    title: text("title").notNull(),
    body: text("body").notNull(),
    data: jsonb("data").$type<Record<string, unknown> | null>(),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("notifications_profile_idx").on(table.profileId),
    index("notifications_type_idx").on(table.type),
  ],
);

export const attachments = pgTable(
  "attachments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerProfileId: uuid("owner_profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    pickupRequestId: uuid("pickup_request_id").references(() => pickupRequests.id, {
      onDelete: "set null",
    }),
    pickupItemId: uuid("pickup_item_id").references(() => pickupItems.id, {
      onDelete: "set null",
    }),
    supportTicketId: uuid("support_ticket_id").references(() => supportTickets.id, {
      onDelete: "set null",
    }),
    disputeId: uuid("dispute_id").references(() => disputes.id, {
      onDelete: "set null",
    }),
    kind: attachmentKindEnum("kind").notNull(),
    fileKey: text("file_key").notNull(),
    fileUrl: text("file_url").notNull(),
    fileName: text("file_name"),
    mimeType: text("mime_type"),
    fileSize: integer("file_size"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("attachments_file_key_idx").on(table.fileKey),
    index("attachments_kind_idx").on(table.kind),
  ],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorProfileId: uuid("actor_profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id"),
    action: text("action").notNull(),
    details: jsonb("details").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("audit_logs_entity_idx").on(table.entityType, table.entityId)],
);

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  collectorProfile: one(collectorProfiles, {
    fields: [profiles.id],
    references: [collectorProfiles.profileId],
  }),
  pickupRequests: many(pickupRequests),
  verificationRecords: many(verificationRecords),
  pointsLedger: many(pointsLedger),
  redemptions: many(redemptionRequests),
  supportTickets: many(supportTickets),
  disputes: many(disputes),
  notifications: many(notifications),
  attachments: many(attachments),
  auditLogs: many(auditLogs),
}));

export const collectorProfilesRelations = relations(
  collectorProfiles,
  ({ one, many }) => ({
    profile: one(profiles, {
      fields: [collectorProfiles.profileId],
      references: [profiles.id],
    }),
    assignedRequests: many(pickupRequests),
  }),
);

export const pickupRequestsRelations = relations(pickupRequests, ({ one, many }) => ({
  requester: one(profiles, {
    fields: [pickupRequests.requesterProfileId],
    references: [profiles.id],
  }),
  assignedCollector: one(collectorProfiles, {
    fields: [pickupRequests.assignedCollectorProfileId],
    references: [collectorProfiles.id],
  }),
  items: many(pickupItems),
  verificationRecords: many(verificationRecords),
  supportTickets: many(supportTickets),
  disputes: many(disputes),
  attachments: many(attachments),
}));

export const pickupItemsRelations = relations(pickupItems, ({ one, many }) => ({
  pickupRequest: one(pickupRequests, {
    fields: [pickupItems.pickupRequestId],
    references: [pickupRequests.id],
  }),
  verificationRecords: many(verificationRecords),
  attachments: many(attachments),
}));

export const verificationRecordsRelations = relations(
  verificationRecords,
  ({ one }) => ({
    pickupRequest: one(pickupRequests, {
      fields: [verificationRecords.pickupRequestId],
      references: [pickupRequests.id],
    }),
    pickupItem: one(pickupItems, {
      fields: [verificationRecords.pickupItemId],
      references: [pickupItems.id],
    }),
    reviewer: one(profiles, {
      fields: [verificationRecords.reviewerProfileId],
      references: [profiles.id],
    }),
  }),
);

export const rewardsRelations = relations(rewards, ({ many }) => ({
  redemptions: many(redemptionRequests),
}));

export const redemptionRequestsRelations = relations(
  redemptionRequests,
  ({ one, many }) => ({
    requester: one(profiles, {
      fields: [redemptionRequests.requesterProfileId],
      references: [profiles.id],
    }),
    reviewer: one(profiles, {
      fields: [redemptionRequests.reviewedByProfileId],
      references: [profiles.id],
    }),
    reward: one(rewards, {
      fields: [redemptionRequests.rewardId],
      references: [rewards.id],
    }),
    ledgerEntries: many(pointsLedger),
  }),
);

export const pointsLedgerRelations = relations(pointsLedger, ({ one }) => ({
  profile: one(profiles, {
    fields: [pointsLedger.profileId],
    references: [profiles.id],
  }),
  pickupRequest: one(pickupRequests, {
    fields: [pointsLedger.pickupRequestId],
    references: [pickupRequests.id],
  }),
  pickupItem: one(pickupItems, {
    fields: [pointsLedger.pickupItemId],
    references: [pickupItems.id],
  }),
  redemptionRequest: one(redemptionRequests, {
    fields: [pointsLedger.redemptionRequestId],
    references: [redemptionRequests.id],
  }),
}));

export const supportTicketsRelations = relations(
  supportTickets,
  ({ one, many }) => ({
    requester: one(profiles, {
      fields: [supportTickets.requesterProfileId],
      references: [profiles.id],
    }),
    assignee: one(profiles, {
      fields: [supportTickets.assignedToProfileId],
      references: [profiles.id],
    }),
    pickupRequest: one(pickupRequests, {
      fields: [supportTickets.pickupRequestId],
      references: [pickupRequests.id],
    }),
    disputes: many(disputes),
    attachments: many(attachments),
  }),
);

export const disputesRelations = relations(disputes, ({ one, many }) => ({
  requester: one(profiles, {
    fields: [disputes.requesterProfileId],
    references: [profiles.id],
  }),
  assignee: one(profiles, {
    fields: [disputes.assignedToProfileId],
    references: [profiles.id],
  }),
  escalatedTo: one(profiles, {
    fields: [disputes.escalatedToProfileId],
    references: [profiles.id],
  }),
  pickupRequest: one(pickupRequests, {
    fields: [disputes.pickupRequestId],
    references: [pickupRequests.id],
  }),
  supportTicket: one(supportTickets, {
    fields: [disputes.supportTicketId],
    references: [supportTickets.id],
  }),
  attachments: many(attachments),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  profile: one(profiles, {
    fields: [notifications.profileId],
    references: [profiles.id],
  }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  owner: one(profiles, {
    fields: [attachments.ownerProfileId],
    references: [profiles.id],
  }),
  pickupRequest: one(pickupRequests, {
    fields: [attachments.pickupRequestId],
    references: [pickupRequests.id],
  }),
  pickupItem: one(pickupItems, {
    fields: [attachments.pickupItemId],
    references: [pickupItems.id],
  }),
  supportTicket: one(supportTickets, {
    fields: [attachments.supportTicketId],
    references: [supportTickets.id],
  }),
  dispute: one(disputes, {
    fields: [attachments.disputeId],
    references: [disputes.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(profiles, {
    fields: [auditLogs.actorProfileId],
    references: [profiles.id],
  }),
}));
