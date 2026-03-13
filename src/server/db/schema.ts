import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const appRoleEnum = pgEnum("app_role", [
  "user",
  "collector",
  "staff",
  "super_admin",
]);

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  fullName: text("full_name"),
  role: appRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
