import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { fetchProtectedProcedure, fetchRouter, fetchUserProcedure } from "../../lib/trpc";

export const wasteDepositRouter = fetchRouter({
  // Create a new waste deposit request
  create: fetchUserProcedure
    .input(
      z.object({
        wasteTypeId: z.string(),
        quantityKg: z.number().min(1),
        latitude: z.number(),
        longitude: z.number(),
        address: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify waste type exists and is active
      const wasteType = await ctx.db.wasteType.findFirst({
        where: {
          id: input.wasteTypeId,
          isActive: true,
        },
      });

      if (!wasteType) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Waste type not found or inactive",
        });
      }

      // Calculate credits based on rate
      const creditsEarned = Number(input.quantityKg) * Number(wasteType.ratePerKg);

      // Create the waste deposit
      const wasteDeposit = await ctx.db.wasteDeposit.create({
        data: {
          userId: ctx.user.id,
          wasteTypeId: input.wasteTypeId,
          quantityKg: input.quantityKg,
          latitude: input.latitude,
          longitude: input.longitude,
          address: input.address,
          creditsEarned,
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

      // TODO: Send notification to nearby waste managers
      // This will be implemented when we add Pusher

      return wasteDeposit;
    }),

  // Get waste deposit by ID
  getById: fetchUserProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const deposit = await ctx.db.wasteDeposit.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
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
      });

      if (!deposit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Waste deposit not found",
        });
      }

      return deposit;
    }),

  // Cancel a waste deposit
  cancel: fetchUserProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deposit = await ctx.db.wasteDeposit.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!deposit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Waste deposit not found",
        });
      }

      if (deposit.status !== "PENDING" && deposit.status !== "ASSIGNED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot cancel deposit in current status",
        });
      }

      const updatedDeposit = await ctx.db.wasteDeposit.update({
        where: { id: input.id },
        data: { status: "CANCELLED" },
        include: {
          wasteType: true,
        },
      });

      return updatedDeposit;
    }),

  // Get all waste types
  getWasteTypes: fetchProtectedProcedure.query(async ({ ctx }) => {
    const wasteTypes = await ctx.db.wasteType.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return wasteTypes;
  }),
});
