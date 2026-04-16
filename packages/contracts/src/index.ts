import { z } from "zod";

export const supportedCities = [
  "Benin City",
  "Lagos",
  "Abuja",
  "Ibadan",
  "Port Harcourt",
] as const;

export const wasteCategories = [
  "plastic",
  "paper",
  "glass",
  "metal",
  "electronic_waste",
  "textile",
  "organic_waste",
  "mixed_recyclables",
] as const;

export const roles = ["user", "collector", "staff", "super_admin"] as const;

export const pickupRequestStatuses = [
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
] as const;

export const citySchema = z.enum(supportedCities);
export const wasteCategorySchema = z.enum(wasteCategories);
export const roleSchema = z.enum(roles);
export const pickupRequestStatusSchema = z.enum(pickupRequestStatuses);

export const pickupWindowSchema = z
  .object({
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
  })
  .refine(
    ({ startAt, endAt }) =>
      new Date(startAt).getTime() < new Date(endAt).getTime(),
    {
      message: "Pickup window end time must be after the start time.",
      path: ["endAt"],
    }
  );

export const createPickupRequestSchema = z.object({
  wasteType: wasteCategorySchema,
  quantityLabel: z.string().min(1).max(128),
  city: citySchema,
  addressLine: z.string().min(5).max(280),
  notes: z.string().max(500).optional(),
  pickupWindow: pickupWindowSchema,
});

export const pickupRequestListFiltersSchema = z.object({
  status: pickupRequestStatusSchema.optional(),
  city: citySchema.optional(),
});

export const pickupRequestSummarySchema = z.object({
  id: z.string().uuid(),
  requesterId: z.string().min(1),
  status: pickupRequestStatusSchema,
  wasteType: wasteCategorySchema,
  quantityLabel: z.string(),
  city: citySchema,
  addressLine: z.string(),
  notes: z.string().nullable(),
  pickupWindow: pickupWindowSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const pickupRequestDetailSchema = pickupRequestSummarySchema.extend({});

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

export const userSessionSchema = z.object({
  userId: z.string().min(1),
  activeRole: roleSchema,
  roles: z.array(roleSchema).min(1),
  sessionId: z.string().optional(),
});

export type Role = z.infer<typeof roleSchema>;
export type PickupRequestStatus = z.infer<typeof pickupRequestStatusSchema>;
export type ApiAuthContext = z.infer<typeof userSessionSchema>;
export type CreatePickupRequestInput = z.infer<
  typeof createPickupRequestSchema
>;
export type PickupRequestListFilters = z.infer<
  typeof pickupRequestListFiltersSchema
> & {
  requesterId?: string;
};
export type PickupRequestSummary = z.infer<typeof pickupRequestSummarySchema>;
export type PickupRequestDetail = z.infer<typeof pickupRequestDetailSchema>;
