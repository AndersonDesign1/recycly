import { z } from "zod"
import { WasteType, WasteBinStatus } from "@prisma/client"

export const createWasteBinSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(WasteType),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
})

export const updateWasteBinSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.nativeEnum(WasteType).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  status: z.nativeEnum(WasteBinStatus).optional(),
  capacity: z.number().min(0).max(100).optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
})

export const wasteBinFilterSchema = z.object({
  type: z.nativeEnum(WasteType).optional(),
  status: z.nativeEnum(WasteBinStatus).optional(),
  nearLocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      radiusKm: z.number().default(10),
    })
    .optional(),
})
