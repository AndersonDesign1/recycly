import { z } from "zod";
import { fetchAdminProcedure, fetchRouter } from "../../lib/trpc";

// Constants for pagination limits
const MAX_USERS_LIMIT = 100;
const DEFAULT_USERS_LIMIT = 20;

export const adminRouter = fetchRouter({
  // Get all users with pagination
  getUsers: fetchAdminProcedure
    .input(
      z.object({
        role: z.string().optional(),
        limit: z
          .number()
          .min(1)
          .max(MAX_USERS_LIMIT)
          .default(DEFAULT_USERS_LIMIT),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        where: {
          ...(input.role && { role: input.role as any }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isVerified: true,
          isAvailable: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
      });

      let nextCursor: typeof input.cursor | undefined;
      if (users.length > input.limit) {
        const nextItem = users.pop();
        nextCursor = nextItem?.id;
      }

      return {
        users,
        nextCursor,
      };
    }),

  // Update user role
  updateUserRole: fetchAdminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["USER", "ADMIN", "WASTE_MANAGER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      return updatedUser;
    }),

  // Get all waste deposits
  getAllDeposits: fetchAdminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        limit: z
          .number()
          .min(1)
          .max(MAX_USERS_LIMIT)
          .default(DEFAULT_USERS_LIMIT),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const deposits = await ctx.db.wasteDeposit.findMany({
        where: {
          ...(input.status && { status: input.status as any }),
        },
        include: {
          wasteType: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          wasteManager: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
      });

      let nextCursor: typeof input.cursor | undefined;
      if (deposits.length > input.limit) {
        const nextItem = deposits.pop();
        nextCursor = nextItem?.id;
      }

      return {
        deposits,
        nextCursor,
      };
    }),

  // Get system statistics
  getStats: fetchAdminProcedure.query(async ({ ctx }) => {
    const [totalUsers, totalDeposits, totalCredits, pendingDeposits] =
      await Promise.all([
        ctx.db.user.count(),
        ctx.db.wasteDeposit.count(),
        ctx.db.credit.aggregate({
          _sum: { amount: true },
        }),
        ctx.db.wasteDeposit.count({
          where: { status: "PENDING" },
        }),
      ]);

    return {
      totalUsers,
      totalDeposits,
      totalCredits: totalCredits._sum.amount || 0,
      pendingDeposits,
    };
  }),

  // Manage waste types
  getWasteTypes: fetchAdminProcedure.query(async ({ ctx }) => {
    const wasteTypes = await ctx.db.wasteType.findMany({
      orderBy: { name: "asc" },
    });

    return wasteTypes;
  }),

  createWasteType: fetchAdminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        ratePerKg: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const wasteType = await ctx.db.wasteType.create({
        data: input,
      });

      return wasteType;
    }),

  updateWasteType: fetchAdminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        ratePerKg: z.number().min(0).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const wasteType = await ctx.db.wasteType.update({
        where: { id },
        data,
      });

      return wasteType;
    }),
});
