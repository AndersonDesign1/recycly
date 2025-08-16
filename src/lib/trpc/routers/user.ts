import { z } from "zod"
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from "@/src/lib/trpc/server"
import { updateUserSchema, userFilterSchema } from "@/lib/validations/user"

export const userRouter = createTRPCRouter({
  // Get current user
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        _count: {
          select: {
            wasteDisposals: true,
            userRewards: true,
            achievements: true,
          },
        },
      },
    })
    return user
  }),

  // Get user by ID
  getById: publicProcedure.input(z.object({ id: z.string().cuid() })).query(async ({ ctx, input }) => {
    return ctx.db.user.findUnique({
      where: { id: input.id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        points: true,
        level: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            wasteDisposals: true,
            userRewards: true,
            achievements: true,
          },
        },
      },
    })
  }),

  // Get all users (admin only)
  getAll: adminProcedure.input(userFilterSchema.optional()).query(async ({ ctx, input }) => {
    const where = {
      ...(input?.role && { role: input.role }),
      ...(input?.isActive !== undefined && { isActive: input.isActive }),
      ...(input?.search && {
        OR: [
          { name: { contains: input.search, mode: "insensitive" as const } },
          { email: { contains: input.search, mode: "insensitive" as const } },
        ],
      }),
    }

    return ctx.db.user.findMany({
      where,
      include: {
        _count: {
          select: {
            wasteDisposals: true,
            userRewards: true,
            achievements: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }),

  // Update user profile
  update: protectedProcedure.input(updateUserSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: input,
    })
  }),

  // Get user leaderboard
  getLeaderboard: publicProcedure.input(z.object({ limit: z.number().default(10) })).query(async ({ ctx, input }) => {
    return ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        points: true,
        level: true,
        role: true,
      },
      orderBy: { points: "desc" },
      take: input.limit,
    })
  }),

  // Get user statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const [totalDisposals, totalPoints, totalRewards, totalAchievements, recentDisposals] = await Promise.all([
      ctx.db.wasteDisposal.count({ where: { userId } }),
      ctx.db.user.findUnique({
        where: { id: userId },
        select: { points: true },
      }),
      ctx.db.userReward.count({ where: { userId } }),
      ctx.db.userAchievement.count({ where: { userId } }),
      ctx.db.wasteDisposal.findMany({
        where: { userId },
        include: { wasteBin: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

    return {
      totalDisposals,
      totalPoints: totalPoints?.points || 0,
      totalRewards,
      totalAchievements,
      recentDisposals,
    }
  }),
})
