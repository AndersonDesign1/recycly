import { WasteType } from "@prisma/client";
import { z } from "zod";

export const createWasteDisposalSchema = z.object({
  wasteBinId: z.string().cuid(),
  wasteType: z.nativeEnum(WasteType),
  weightKg: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export const verifyWasteDisposalSchema = z.object({
  id: z.string().cuid(),
  verified: z.boolean(),
});
