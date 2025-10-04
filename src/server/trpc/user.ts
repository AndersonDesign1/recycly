import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { fetchRouter, fetchUserProcedure } from "../../lib/trpc";

// Constants for pagination limits
const MAX_DEPOSITS_LIMIT = 100;
const DEFAULT_DEPOSITS_LIMIT = 10;
const MAX_CREDITS_LIMIT = 100;
const DEFAULT_CREDITS_LIMIT = 20;

export const userRouter = fetchRouter({
  // Get current user profile
  getProfile: fetchUserProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        latitude: true,
        longitude: true,
        address: true,
        isVerified: true,
        isAvailable: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return user;
  }),

  // Update user profile
  updateProfile: fetchUserProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        phone: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: input,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          latitude: true,
          longitude: true,
          address: true,
          isVerified: true,
          isAvailable: true,
        },
      });

      return updatedUser;
    }),

  // Get user's waste deposits
  getWasteDeposits: fetchUserProcedure
    .input(
      z.object({
        status: z.string().optional(),
        limit: z
          .number()
          .min(1)
          .max(MAX_DEPOSITS_LIMIT)
          .default(DEFAULT_DEPOSITS_LIMIT),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const deposits = await ctx.db.wasteDeposit.findMany({
        where: {
          userId: ctx.user.id,
          ...(input.status && { status: input.status as any }),
        },
        include: {
          wasteType: true,
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

  // Get user's credits
  getCredits: fetchUserProcedure
    .input(
      z.object({
        limit: z
          .number()
          .min(1)
          .max(MAX_CREDITS_LIMIT)
          .default(DEFAULT_CREDITS_LIMIT),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const credits = await ctx.db.credit.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
      });

      let nextCursor: typeof input.cursor | undefined;
      if (credits.length > input.limit) {
        const nextItem = credits.pop();
        nextCursor = nextItem?.id;
      }

      return {
        credits,
        nextCursor,
      };
    }),

  // Get user's total credit balance
  getCreditBalance: fetchUserProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.credit.aggregate({
      where: { userId: ctx.user.id },
      _sum: { amount: true },
    });

    return {
      balance: result._sum.amount || 0,
    };
  }),
});
