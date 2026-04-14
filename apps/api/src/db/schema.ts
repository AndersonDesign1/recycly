import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const pickupRequestsTable = pgTable("pickup_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  requesterId: varchar("requester_id", { length: 128 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  wasteType: varchar("waste_type", { length: 32 }).notNull(),
  quantityLabel: varchar("quantity_label", { length: 128 }).notNull(),
  city: varchar("city", { length: 64 }).notNull(),
  addressLine: text("address_line").notNull(),
  notes: text("notes"),
  pickupWindow: jsonb("pickup_window").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
