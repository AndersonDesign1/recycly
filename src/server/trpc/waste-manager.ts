import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { fetchRouter, fetchWasteManagerProcedure } from "../../lib/trpc";

// Constants for pagination limits
const MAX_DEPOSITS_LIMIT = 100;
const DEFAULT_DEPOSITS_LIMIT = 10;

export const wasteManagerRouter = fetchRouter({
  // Get available waste deposits for assignment
  getAvailableDeposits: fetchWasteManagerProcedure
    .input(
      z.object({
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
          status: "PENDING",
        },
        include: {
          wasteType: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              address: true,
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

  // Accept a waste deposit assignment
  acceptDeposit: fetchWasteManagerProcedure
    .input(z.object({ depositId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if deposit is still available
      const deposit = await ctx.db.wasteDeposit.findFirst({
        where: {
          id: input.depositId,
          status: "PENDING",
        },
      });

      if (!deposit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deposit not available for assignment",
        });
      }

      // Update deposit status and assign to waste manager
      const updatedDeposit = await ctx.db.wasteDeposit.update({
        where: { id: input.depositId },
        data: {
          status: "ASSIGNED",
          wasteManagerId: ctx.user.id,
          assignedAt: new Date(),
        },
        include: {
          wasteType: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              address: true,
            },
          },
        },
      });

      return updatedDeposit;
    }),

  // Mark deposit as collected
  markCollected: fetchWasteManagerProcedure
    .input(
      z.object({
        depositId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deposit = await ctx.db.wasteDeposit.findFirst({
        where: {
          id: input.depositId,
          wasteManagerId: ctx.user.id,
          status: "ASSIGNED",
        },
      });

      if (!deposit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deposit not found or not assigned to you",
        });
      }

      const updatedDeposit = await ctx.db.wasteDeposit.update({
        where: { id: input.depositId },
        data: {
          status: "COLLECTED",
          collectedAt: new Date(),
          notes: input.notes,
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
        },
      });

      return updatedDeposit;
    }),

  // Get waste manager's assigned deposits
  getMyDeposits: fetchWasteManagerProcedure
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
          wasteManagerId: ctx.user.id,
          ...(input.status && { status: input.status as any }),
        },
        include: {
          wasteType: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              address: true,
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
});
