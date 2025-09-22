import { z } from "zod";

// Waste disposal validation
export const wasteDisposalSchema = z.object({
  wasteBinId: z.string().cuid("Invalid waste bin ID"),
  wasteType: z.enum([
    "RECYCLING",
    "COMPOST",
    "GENERAL",
    "ELECTRONIC",
    "HAZARDOUS",
    "TEXTILE",
    "GLASS",
    "METAL",
    "PAPER",
    "PLASTIC",
  ]),
  weightKg: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

// Report validation
export const reportSchema = z.object({
  wasteBinId: z.string().cuid().optional(),
  type: z.enum([
    "BIN_FULL",
    "BIN_DAMAGED",
    "ILLEGAL_DUMPING",
    "CONTAMINATION",
    "MISSING_BIN",
    "OTHER",
  ]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url().optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

// Waste bin validation
export const wasteBinSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum([
    "RECYCLING",
    "COMPOST",
    "GENERAL",
    "ELECTRONIC",
    "HAZARDOUS",
    "TEXTILE",
    "GLASS",
    "METAL",
    "PAPER",
    "PLASTIC",
  ]),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

// Reward validation
export const rewardSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  pointsRequired: z.number().positive("Points required must be positive"),
  category: z.enum([
    "DISCOUNT",
    "VOUCHER",
    "PRODUCT",
    "EXPERIENCE",
    "DONATION",
    "CASHBACK",
  ]),
  stock: z.number().positive().optional(),
  expiresAt: z.string().datetime().optional(),
  terms: z.string().optional(),
  partnerName: z.string().optional(),
  partnerLogo: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
});
