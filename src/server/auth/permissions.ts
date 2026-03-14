import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import type { AppRole } from "@/lib/roles";
import { db } from "@/server/db/client";
import { profiles } from "@/server/db/schema";

export async function requireSignedIn() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return userId;
}

export async function getCurrentProfile() {
  const userId = await requireSignedIn();

  if (!db) {
    return null;
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.clerkUserId, userId))
    .limit(1);

  return profile ?? null;
}

export async function ensureProfile() {
  const userId = await requireSignedIn();

  if (!db) {
    return null;
  }

  const existingProfile = await getCurrentProfile();
  if (existingProfile) {
    return existingProfile;
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("Unable to load Clerk user");
  }

  const [createdProfile] = await db
    .insert(profiles)
    .values({
      clerkUserId: userId,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      fullName:
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username ||
        "New Recycly User",
      avatarUrl: user.imageUrl ?? null,
      role: "user",
    })
    .returning();

  return createdProfile ?? null;
}

export async function requireProfile() {
  const profile = await ensureProfile();

  if (!profile) {
    throw new Error("Profile unavailable");
  }

  return profile;
}

export async function requireRole(allowed: AppRole | AppRole[]) {
  const profile = await requireProfile();
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

  if (!allowedRoles.includes(profile.role)) {
    throw new Error("Unauthorized");
  }

  return profile;
}
