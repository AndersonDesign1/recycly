import { z } from "zod"
import { createTRPCRouter, protectedProcedure, adminProcedure } from "@/src/lib/trpc/server"
import { createWasteDisposalSchema, verifyWasteDisposalSchema } from "@/lib/validations/waste-disposal"

export const wasteDisposalRouter = createTRPCRouter({
  // Create waste disposal
  create: protectedProcedure.input(createWasteDisposalSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    // Calculate points based on waste type and weight
    const basePoints = getBasePointsForWasteType(input.wasteType)
    const weightMultiplier = input.weightKg ? Math.min(input.weightKg * 2, 10) : 1
    const pointsEarned = Math.round(basePoints * weightMultiplier)

    // Create the disposal record
    const disposal = await ctx.db.wasteDisposal.create({
      data: {
        userId,
        wasteBinId: input.wasteBinId,
        wasteType: input.wasteType,
        weightKg: input.weightKg,
        imageUrl: input.imageUrl,
        location: input.location,
        pointsEarned,
      },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        wasteBin: { select: { name: true, type: true } },
      },
    })

    // Update user points
    await ctx.db.user.update({
      where: { id: userId },
      data: {
        points: { increment: pointsEarned },
      },
    })

    // Check for level up
    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      select: { points: true, level: true },
    })

    if (user) {
      const newLevel = calculateLevel(user.points)
      if (newLevel > user.level) {
        await ctx.db.user.update({
          where: { id: userId },
          data: { level: newLevel },
        })
      }
    }

    return disposal
  }),

  // Get user's disposals
  getMy: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.wasteDisposal.findMany({
        where: { userId: ctx.session.user.id },
        include: {
          wasteBin: { select: { name: true, type: true, address: true } },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
      })
    }),

  // Get all disposals (admin only)
  getAll: adminProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
        verified: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = input.verified !== undefined ? { verified: input.verified } : {}

      return ctx.db.wasteDisposal.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, avatarUrl: true } },
          wasteBin: { select: { name: true, type: true, address: true } },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
      })
    }),

  // Verify disposal (admin only)
  verify: adminProcedure.input(verifyWasteDisposalSchema).mutation(async ({ ctx, input }) => {
    const disposal = await ctx.db.wasteDisposal.findUnique({
      where: { id: input.id },
      include: { user: true },
    })

    if (!disposal) {
      throw new Error("Disposal not found")
    }

    // If unverifying, subtract points
    if (!input.verified && disposal.verified) {
      await ctx.db.user.update({
        where: { id: disposal.userId },
        data: {
          points: { decrement: disposal.pointsEarned },
        },
      })
    }

    // If verifying, add points (if not already verified)
    if (input.verified && !disposal.verified) {
      await ctx.db.user.update({
        where: { id: disposal.userId },
        data: {
          points: { increment: disposal.pointsEarned },
        },
      })
    }

    return ctx.db.wasteDisposal.update({
      where: { id: input.id },
      data: {
        verified: input.verified,
        verifiedAt: input.verified ? new Date() : null,
        verifiedBy: input.verified ? ctx.session.user.id : null,
      },
    })
  }),

  // Get disposal statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const [totalDisposals, totalPoints, disposalsByType, recentDisposals] = await Promise.all([
      ctx.db.wasteDisposal.count({ where: { userId } }),
      ctx.db.wasteDisposal.aggregate({
        where: { userId },
        _sum: { pointsEarned: true },
      }),
      ctx.db.wasteDisposal.groupBy({
        by: ["wasteType"],
        where: { userId },
        _count: { wasteType: true },
      }),
      ctx.db.wasteDisposal.findMany({
        where: { userId },
        include: { wasteBin: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

    return {
      totalDisposals,
      totalPoints: totalPoints._sum.pointsEarned || 0,
      disposalsByType,
      recentDisposals,
    }
  }),
})

function getBasePointsForWasteType(wasteType: string): number {
  const pointsMap: Record<string, number> = {
    RECYCLING: 10,
    COMPOST: 8,
    ELECTRONIC: 15,
    HAZARDOUS: 20,
    TEXTILE: 12,
    GLASS: 10,
    METAL: 12,
    PAPER: 8,
    PLASTIC: 10,
    GENERAL: 5,
  }
  return pointsMap[wasteType] || 5
}

function calculateLevel(points: number): number {
  // Simple level calculation: every 100 points = 1 level
  return Math.floor(points / 100) + 1
}
