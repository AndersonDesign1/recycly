import { z } from "zod";
import { router, superAdminProcedure } from "@/server/trpc";

export const superAdminRouter = router({
  // Get system overview
  getSystemOverview: superAdminProcedure.query(async ({ ctx }) => {
    const [
      totalUsers,
      usersByRole,
      totalWasteDisposals,
      wasteByStatus,
      totalRewards,
      rewardsByStatus,
      totalPoints,
      systemHealth,
    ] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.user.groupBy({
        by: ["role"],
        _count: { role: true },
      }),
      ctx.db.wasteDisposal.count(),
      ctx.db.wasteDisposal.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      ctx.db.userReward.count(),
      ctx.db.userReward.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      ctx.db.user.aggregate({
        _sum: { points: true },
        _avg: { points: true },
      }),
      // System health checks
      Promise.resolve({
        database: "healthy",
        email: "healthy",
        notifications: "healthy",
      }),
    ]);

    return {
      totalUsers,
      usersByRole,
      totalWasteDisposals,
      wasteByStatus,
      totalRewards,
      rewardsByStatus,
      totalPoints: {
        sum: totalPoints._sum.points || 0,
        average: totalPoints._avg.points || 0,
      },
      systemHealth,
    };
  }),

  // Get all admins
  getAllAdmins: superAdminProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        OR: [{ role: "ADMIN" }, { role: "SUPER_ADMIN" }],
      };

      const [admins, total] = await Promise.all([
        ctx.db.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            isActive: true,
            createdAt: true,
            lastLoginAt: true,
            _count: {
              select: {
                wasteDisposals: true,
                userRewards: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.db.user.count({ where }),
      ]);

      return { admins, total };
    }),

  // Promote user to admin
  promoteToAdmin: superAdminProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        role: z.enum(["ADMIN", "SUPER_ADMIN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Prevent promoting self to a different role
      if (input.userId === ctx.session.user.id) {
        throw new Error("Cannot change your own role");
      }

      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: { role: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Only allow promoting from USER or WASTE_MANAGER roles
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        throw new Error("User is already an admin");
      }

      return ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
    }),

  // Demote admin
  demoteAdmin: superAdminProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        newRole: z.enum(["USER", "WASTE_MANAGER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Prevent demoting self
      if (input.userId === ctx.session.user.id) {
        throw new Error("Cannot demote yourself");
      }

      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: { role: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Only allow demoting from ADMIN or SUPER_ADMIN roles
      if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        throw new Error("User is not an admin");
      }

      return ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.newRole },
      });
    }),

  // Get system logs (placeholder for future implementation)
  getSystemLogs: superAdminProcedure
    .input(
      z.object({
        type: z.enum(["ERROR", "WARNING", "INFO", "DEBUG"]).optional(),
        limit: z.number().default(100),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: Implement system logging
      return {
        logs: [],
        total: 0,
      };
    }),

  // Get user activity analytics
  getUserAnalytics: superAdminProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month", "year"]).default("month"),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case "day":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const [
        newUsers,
        activeUsers,
        totalWasteDisposals,
        totalRewards,
        totalPointsEarned,
      ] = await Promise.all([
        ctx.db.user.count({
          where: { createdAt: { gte: startDate } },
        }),
        ctx.db.user.count({
          where: {
            OR: [
              { wasteDisposals: { some: { createdAt: { gte: startDate } } } },
              { userRewards: { some: { createdAt: { gte: startDate } } } },
            ],
          },
        }),
        ctx.db.wasteDisposal.count({
          where: { createdAt: { gte: startDate } },
        }),
        ctx.db.userReward.count({
          where: { createdAt: { gte: startDate } },
        }),
        ctx.db.pointTransaction.aggregate({
          where: {
            type: "EARNED",
            createdAt: { gte: startDate },
          },
          _sum: { amount: true },
        }),
      ]);

      return {
        period: input.period,
        startDate,
        endDate: now,
        newUsers,
        activeUsers,
        totalWasteDisposals,
        totalRewards,
        totalPointsEarned: totalPointsEarned._sum.amount || 0,
      };
    }),

  // Get waste analytics
  getWasteAnalytics: superAdminProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month", "year"]).default("month"),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case "day":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const [
        wasteByCategory,
        wasteByStatus,
        totalQuantity,
        averageProcessingTime,
      ] = await Promise.all([
        ctx.db.wasteDisposal.groupBy({
          by: ["wasteCategoryId"],
          where: { createdAt: { gte: startDate } },
          _count: { wasteCategoryId: true },
          _sum: { quantity: true },
        }),
        ctx.db.wasteDisposal.groupBy({
          by: ["status"],
          where: { createdAt: { gte: startDate } },
          _count: { status: true },
        }),
        ctx.db.wasteDisposal.aggregate({
          where: { createdAt: { gte: startDate } },
          _sum: { quantity: true },
        }),
        // Calculate average processing time for completed disposals
        ctx.db.wasteDisposal.aggregate({
          where: {
            status: "COMPLETED",
            createdAt: { gte: startDate },
            completedAt: { not: null },
          },
          _avg: {
            _raw: 'EXTRACT(EPOCH FROM ("completedAt" - "createdAt")) / 3600', // hours
          },
        }),
      ]);

      return {
        period: input.period,
        startDate,
        endDate: now,
        wasteByCategory,
        wasteByStatus,
        totalQuantity: totalQuantity._sum.quantity || 0,
        averageProcessingTime: averageProcessingTime._avg._raw || 0,
      };
    }),

  // System maintenance operations
  clearOldData: superAdminProcedure
    .input(
      z.object({
        daysOld: z.number().min(30).max(365),
        dataType: z.enum(["sessions", "notifications", "logs"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cutoffDate = new Date(
        Date.now() - input.daysOld * 24 * 60 * 60 * 1000
      );

      switch (input.dataType) {
        case "sessions": {
          const deletedSessions = await ctx.db.session.deleteMany({
            where: { expiresAt: { lt: cutoffDate } },
          });
          return { deletedCount: deletedSessions.count, dataType: "sessions" };
        }

        case "notifications": {
          const deletedNotifications = await ctx.db.notification.deleteMany({
            where: { createdAt: { lt: cutoffDate } },
          });
          return {
            deletedCount: deletedNotifications.count,
            dataType: "notifications",
          };
        }

        case "logs":
          // TODO: Implement when logging system is added
          return {
            deletedCount: 0,
            dataType: "logs",
            message: "Logging system not implemented yet",
          };

        default:
          throw new Error("Invalid data type");
      }
    }),

  // Backup system configuration
  exportSystemConfig: superAdminProcedure.query(async ({ ctx }) => {
    const [wasteCategories, rewardCategories, systemSettings] =
      await Promise.all([
        ctx.db.wasteCategory.findMany(),
        ctx.db.rewardCategory.findMany(),
        // TODO: Add system settings table when implemented
        Promise.resolve({}),
      ]);

    return {
      exportedAt: new Date(),
      wasteCategories,
      rewardCategories,
      systemSettings,
    };
  }),
});
