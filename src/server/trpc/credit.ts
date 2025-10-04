import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { fetchRouter, fetchUserProcedure } from "../../lib/trpc";

// Constants for pagination limits
const MAX_CREDITS_LIMIT = 100;
const DEFAULT_CREDITS_LIMIT = 20;
const MAX_PAYOUT_REQUESTS_LIMIT = 100;
const DEFAULT_PAYOUT_REQUESTS_LIMIT = 10;

export const creditRouter = fetchRouter({
  // Get user's credit balance
  getBalance: fetchUserProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.credit.aggregate({
      where: { userId: ctx.user.id },
      _sum: { amount: true },
    });

    return {
      balance: result._sum.amount || 0,
    };
  }),

  // Get credit history
  getHistory: fetchUserProcedure
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
        include: {
          wasteDeposit: {
            select: {
              id: true,
              wasteType: {
                select: {
                  name: true,
                },
              },
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
      if (credits.length > input.limit) {
        const nextItem = credits.pop();
        nextCursor = nextItem?.id;
      }

      return {
        credits,
        nextCursor,
      };
    }),

  // Request payout
  requestPayout: fetchUserProcedure
    .input(
      z.object({
        amount: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has sufficient balance
      const balance = await ctx.db.credit.aggregate({
        where: { userId: ctx.user.id },
        _sum: { amount: true },
      });

      const currentBalance = Number(balance._sum.amount || 0);

      if (currentBalance < input.amount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient credit balance",
        });
      }

      // Create payout request
      const payoutRequest = await ctx.db.payoutRequest.create({
        data: {
          userId: ctx.user.id,
          amount: input.amount,
        },
      });

      return payoutRequest;
    }),

  // Get payout requests (for user)
  getPayoutRequests: fetchUserProcedure
    .input(
      z.object({
        limit: z
          .number()
          .min(1)
          .max(MAX_PAYOUT_REQUESTS_LIMIT)
          .default(DEFAULT_PAYOUT_REQUESTS_LIMIT),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const requests = await ctx.db.payoutRequest.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
      });

      let nextCursor: typeof input.cursor | undefined;
      if (requests.length > input.limit) {
        const nextItem = requests.pop();
        nextCursor = nextItem?.id;
      }

      return {
        requests,
        nextCursor,
      };
    }),
});
