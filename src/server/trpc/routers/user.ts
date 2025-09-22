import { z } from "zod";
import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "@/server/trpc";

export const userRouter = router({
  // Get current user profile
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
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),

  // Get user by ID (public)
  getById: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          image: true,
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
      });
    }),

  // Get all users (admin only)
  getAll: adminProcedure
    .input(
      z
        .object({
          role: z
            .enum(["USER", "WASTE_MANAGER", "ADMIN", "SUPER_ADMIN"])
            .optional(),
          isActive: z.boolean().optional(),
          search: z.string().optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input?.role && { role: input.role }),
        ...(input?.isActive !== undefined && { isActive: input.isActive }),
        ...(input?.search && {
          OR: [
            { name: { contains: input.search, mode: "insensitive" as const } },
            { email: { contains: input.search, mode: "insensitive" as const } },
          ],
        }),
      };

      const [users, total] = await Promise.all([
        ctx.db.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            points: true,
            level: true,
            role: true,
            isActive: true,
            createdAt: true,
            _count: {
              select: {
                wasteDisposals: true,
                userRewards: true,
                achievements: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: input?.limit || 50,
          skip: input?.offset || 0,
        }),
        ctx.db.user.count({ where }),
      ]);

      return { users, total };
    }),

  // Update user profile
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),

  // Get user leaderboard
  getLeaderboard: publicProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        role: z
          .enum(["USER", "WASTE_MANAGER", "ADMIN", "SUPER_ADMIN"])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = input.role ? { role: input.role } : {};

      return ctx.db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          image: true,
          points: true,
          level: true,
          role: true,
        },
        orderBy: { points: "desc" },
        take: input.limit,
      });
    }),

  // Get user statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const [totalWaste, totalRewards, totalPoints, level] = await Promise.all([
      ctx.db.wasteDisposal.count({
        where: { userId, status: "APPROVED" },
      }),
      ctx.db.userReward.count({
        where: { userId },
      }),
      ctx.db.user.findUnique({
        where: { id: userId },
        select: { points: true, level: true },
      }),
    ]);

    return {
      totalWaste,
      totalRewards,
      totalPoints: totalPoints?.points || 0,
      level: totalPoints?.level || 1,
    };
  }),

  // Get user achievements
  getAchievements: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.userAchievement.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        achievement: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get user rewards history
  getRewardsHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const [rewards, total] = await Promise.all([
        ctx.db.userReward.findMany({
          where: { userId: ctx.session.user.id },
          include: {
            reward: true,
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.db.userReward.count({
          where: { userId: ctx.session.user.id },
        }),
      ]);

      return { rewards, total };
    }),
});
