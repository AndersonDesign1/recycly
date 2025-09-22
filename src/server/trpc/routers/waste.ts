import { z } from "zod";
import {
  router,
  publicProcedure,
  protectedProcedure,
  wasteManagerProcedure,
  adminProcedure,
} from "@/server/trpc";

export const wasteRouter = router({
  // Get all waste categories
  getCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.wasteCategory.findMany({
      orderBy: { name: "asc" },
    });
  }),

  // Get waste category by ID
  getCategoryById: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.wasteCategory.findUnique({
        where: { id: input.id },
      });
    }),

  // Submit waste disposal (users only)
  submitWaste: protectedProcedure
    .input(
      z.object({
        wasteCategoryId: z.string().cuid(),
        quantity: z.number().positive(),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        location: z.object({
          latitude: z.number(),
          longitude: z.number(),
          address: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has the USER role
      if (ctx.session.user.role !== "USER") {
        throw new Error("Only users can submit waste");
      }

      // Create waste disposal record
      const wasteDisposal = await ctx.db.wasteDisposal.create({
        data: {
          userId: ctx.session.user.id,
          wasteCategoryId: input.wasteCategoryId,
          quantity: input.quantity,
          description: input.description,
          imageUrl: input.imageUrl,
          latitude: input.location.latitude,
          longitude: input.location.longitude,
          address: input.location.address,
          status: "PENDING",
        },
        include: {
          wasteCategory: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Notify waste managers (optional - can be implemented with notifications service)

      return wasteDisposal;
    }),

  // Get user's waste submissions
  getUserSubmissions: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["PENDING", "APPROVED", "REJECTED", "IN_PROGRESS", "COMPLETED"])
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

      const [submissions, total] = await Promise.all([
        ctx.db.wasteDisposal.findMany({
          where,
          include: {
            wasteCategory: true,
            assignedManager: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.db.wasteDisposal.count({ where }),
      ]);

      return { submissions, total };
    }),

  // Get waste submission by ID
  getSubmissionById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const submission = await ctx.db.wasteDisposal.findUnique({
        where: { id: input.id },
        include: {
          wasteCategory: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignedManager: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!submission) {
        throw new Error("Waste submission not found");
      }

      // Check if user owns this submission or is assigned manager
      if (
        submission.userId !== ctx.session.user.id &&
        submission.assignedManagerId !== ctx.session.user.id
      ) {
        throw new Error("Access denied");
      }

      return submission;
    }),

  // Get assigned waste collections (waste managers only)
  getAssignedCollections: wasteManagerProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        assignedManagerId: ctx.session.user.id,
        ...(input.status && { status: input.status }),
      };

      const [collections, total] = await Promise.all([
        ctx.db.wasteDisposal.findMany({
          where,
          include: {
            wasteCategory: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.db.wasteDisposal.count({ where }),
      ]);

      return { collections, total };
    }),

  // Update waste disposal status (waste managers only)
  updateStatus: wasteManagerProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        status: z.enum(["IN_PROGRESS", "COMPLETED", "REJECTED"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const wasteDisposal = await ctx.db.wasteDisposal.findUnique({
        where: { id: input.id },
        include: {
          user: true,
          wasteCategory: true,
        },
      });

      if (!wasteDisposal) {
        throw new Error("Waste disposal not found");
      }

      // Check if user is assigned to this disposal
      if (wasteDisposal.assignedManagerId !== ctx.session.user.id) {
        throw new Error("Not assigned to this waste disposal");
      }

      // Update status
      const updated = await ctx.db.wasteDisposal.update({
        where: { id: input.id },
        data: {
          status: input.status,
          notes: input.notes,
          ...(input.status === "COMPLETED" && { completedAt: new Date() }),
        },
      });

      // If completed, trigger reward distribution
      if (input.status === "COMPLETED") {
        try {
          const { RewardService } = await import("../../services/rewards");
          await RewardService.distributeWasteDisposalRewards(input.id);
        } catch (error) {
          console.error("Failed to distribute rewards:", error);
          // Don't fail the status update if reward distribution fails
        }
      }

      return updated;
    }),

  // Get all waste submissions (admin only)
  getAllSubmissions: adminProcedure
    .input(
      z.object({
        status: z
          .enum(["PENDING", "APPROVED", "REJECTED", "IN_PROGRESS", "COMPLETED"])
          .optional(),
        wasteCategoryId: z.string().cuid().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input.status && { status: input.status }),
        ...(input.wasteCategoryId && {
          wasteCategoryId: input.wasteCategoryId,
        }),
      };

      const [submissions, total] = await Promise.all([
        ctx.db.wasteDisposal.findMany({
          where,
          include: {
            wasteCategory: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            assignedManager: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.db.wasteDisposal.count({ where }),
      ]);

      return { submissions, total };
    }),

  // Assign waste manager to disposal (admin only)
  assignManager: adminProcedure
    .input(
      z.object({
        wasteDisposalId: z.string().cuid(),
        managerId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the manager has the correct role
      const manager = await ctx.db.user.findUnique({
        where: { id: input.managerId },
        select: { role: true },
      });

      if (
        !manager ||
        (manager.role !== "WASTE_MANAGER" && manager.role !== "ADMIN")
      ) {
        throw new Error("Invalid manager selected");
      }

      return ctx.db.wasteDisposal.update({
        where: { id: input.wasteDisposalId },
        data: {
          assignedManagerId: input.managerId,
          status: "IN_PROGRESS",
        },
      });
    }),
});
