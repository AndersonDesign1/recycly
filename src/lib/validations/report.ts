import { z } from "zod"
import { ReportType, ReportStatus, ReportPriority } from "@prisma/client"

export const createReportSchema = z.object({
  wasteBinId: z.string().cuid().optional(),
  type: z.nativeEnum(ReportType),
  description: z.string().min(1).max(500),
  imageUrl: z.string().url().optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
})

export const updateReportSchema = z.object({
  status: z.nativeEnum(ReportStatus).optional(),
  priority: z.nativeEnum(ReportPriority).optional(),
  resolvedBy: z.string().optional(),
})
