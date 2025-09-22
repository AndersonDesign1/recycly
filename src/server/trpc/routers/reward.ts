import { z } from "zod";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "@/server/trpc";

export const rewardRouter = router({
  // Get user's token balance
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { points: true, level: true },
    });

    return {
      points: user?.points || 0,
      level: user?.level || 1,
    };
  }),

  // Get reward categories
  getRewardCategories: publicProcedure.query(async ({ ctx }) =>
    ctx.db.rewardCategory.findMany({
      orderBy: { name: "asc" },
    })
  ),

  // Get available rewards
  getAvailableRewards: publicProcedure
    .input(
      z.object({
        categoryId: z.string().cuid().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        isActive: true,
        ...(input.categoryId && { categoryId: input.categoryId }),
      };

      const [rewards, total] = await Promise.all([
        ctx.db.reward.findMany({
          where,
          include: {
            category: true,
          },
          orderBy: { pointsRequired: "asc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.db.reward.count({ where }),
      ]);

      return { rewards, total };
    }),

  // Redeem reward
  redeemReward: protectedProcedure
    .input(
      z.object({
        rewardId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get reward details
      const reward = await ctx.db.reward.findUnique({
        where: { id: input.rewardId },
        include: { category: true },
      });

      if (!reward) {
        throw new Error("Reward not found");
      }

      if (!reward.isActive) {
        throw new Error("Reward is not available");
      }

      // Check if user has enough points
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { points: true },
      });

      if (!user || user.points < reward.pointsRequired) {
        throw new Error("Insufficient points");
      }

      // Create redemption record
      const redemption = await ctx.db.userReward.create({
        data: {
          userId: ctx.session.user.id,
          rewardId: input.rewardId,
          pointsSpent: reward.pointsRequired,
          status: "PENDING",
        },
        include: {
          reward: true,
        },
      });

      // Deduct points from user
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          points: {
            decrement: reward.pointsRequired,
          },
        },
      });

      // TODO: Send notification to admin for approval if required
      // TODO: Send email confirmation to user

      return redemption;
    }),

  // Get user's redemption history
  getRedemptionHistory: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["PENDING", "APPROVED", "REJECTED", "COMPLETED"])
          .optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        userId: ctx.session.user.id,
        ...(input.status && { status: input.status }),
      };

      const [redemptions, total] = await Promise.all([
        ctx.db.userReward.findMany({
          where,
          include: {
            reward: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.db.userReward.count({ where }),
      ]);

      return { redemptions, total };
    }),

  // Get transaction history
  getTransactionHistory: protectedProcedure
    .input(
      z.object({
        type: z.enum(["EARNED", "SPENT", "BONUS", "PENALTY"]).optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        userId: ctx.session.user.id,
        ...(input.type && { type: input.type }),
      };

      const [transactions, total] = await Promise.all([
        ctx.db.pointTransaction.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.db.pointTransaction.count({ where }),
      ]);

      return { transactions, total };
    }),

  // Get leaderboard
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

  // Admin: Approve/reject redemption
  updateRedemptionStatus: adminProcedure
    .input(
      z.object({
        redemptionId: z.string().cuid(),
        status: z.enum(["APPROVED", "REJECTED", "COMPLETED"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const redemption = await ctx.db.userReward.findUnique({
        where: { id: input.redemptionId },
        include: {
          user: true,
          reward: true,
        },
      });

      if (!redemption) {
        throw new Error("Redemption not found");
      }

      // Update status
      const updated = await ctx.db.userReward.update({
        where: { id: input.redemptionId },
        data: {
          status: input.status,
          adminNotes: input.notes,
          ...(input.status === "APPROVED" && { approvedAt: new Date() }),
          ...(input.status === "COMPLETED" && { completedAt: new Date() }),
        },
      });

      // If rejected, refund points
      if (input.status === "REJECTED") {
        await ctx.db.user.update({
          where: { id: redemption.userId },
          data: {
            points: {
              increment: redemption.pointsSpent,
            },
          },
        });

        // Create transaction record for refund
        await ctx.db.pointTransaction.create({
          data: {
            userId: redemption.userId,
            type: "BONUS",
            amount: redemption.pointsSpent,
            description: `Refund for rejected reward: ${redemption.reward.name}`,
            referenceId: redemption.id,
            referenceType: "REDEMPTION_REFUND",
          },
        });
      }

      // TODO: Send notification to user about status change

      return updated;
    }),

  // Admin: Get all redemptions
  getAllRedemptions: adminProcedure
    .input(
      z.object({
        status: z
          .enum(["PENDING", "APPROVED", "REJECTED", "COMPLETED"])
          .optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input.status && { status: input.status }),
      };

      const [redemptions, total] = await Promise.all([
        ctx.db.userReward.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            reward: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.db.userReward.count({ where }),
      ]);

      return { redemptions, total };
    }),
});
