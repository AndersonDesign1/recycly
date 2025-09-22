import { z } from "zod";

export const createRewardSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  pointsRequired: z.number().positive(),
  imageUrl: z.string().url().optional(),
  category: z.string(), // Use string instead of enum for now
  stock: z.number().positive().optional(),
  expiresAt: z.date().optional(),
  terms: z.string().optional(),
  partnerName: z.string().optional(),
  partnerLogo: z.string().url().optional(),
});

export const updateRewardSchema = createRewardSchema.partial();

export const redeemRewardSchema = z.object({
  rewardId: z.string().cuid(),
});
