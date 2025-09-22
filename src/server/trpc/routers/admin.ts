import { z } from "zod";
import { router, adminProcedure } from "@/server/trpc";

export const adminRouter = router({
  // Get system statistics
  getSystemStats: adminProcedure.query(async ({ ctx }) => {
    const [
      totalUsers,
      totalWasteDisposals,
      pendingWasteDisposals,
      totalRewards,
      pendingRewards,
      totalPoints,
    ] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.wasteDisposal.count(),
      ctx.db.wasteDisposal.count({ where: { status: "PENDING" } }),
      ctx.db.reward.count(),
      ctx.db.userReward.count({ where: { status: "PENDING" } }),
      ctx.db.user.aggregate({
        _sum: { points: true },
      }),
    ]);

    return {
      totalUsers,
      totalWasteDisposals,
      pendingWasteDisposals,
      totalRewards,
      pendingRewards,
      totalPoints: totalPoints._sum.points || 0,
    };
  }),

  // Get pending waste submissions
  getPendingWasteSubmissions: adminProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const [submissions, total] = await Promise.all([
        ctx.db.wasteDisposal.findMany({
          where: { status: "PENDING" },
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
          orderBy: { createdAt: "asc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.db.wasteDisposal.count({ where: { status: "PENDING" } }),
      ]);

      return { submissions, total };
    }),

  // Approve waste submission
  approveWasteSubmission: adminProcedure
    .input(
      z.object({
        wasteDisposalId: z.string().cuid(),
        managerId: z.string().cuid(),
        notes: z.string().optional(),
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

      // Update waste disposal status
      const updated = await ctx.db.wasteDisposal.update({
        where: { id: input.wasteDisposalId },
        data: {
          status: "APPROVED",
          assignedManagerId: input.managerId,
          adminNotes: input.notes,
          approvedAt: new Date(),
        },
        include: {
          wasteCategory: true,
          user: true,
          assignedManager: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // TODO: Send notification to assigned manager
      // TODO: Send notification to user about approval

      return updated;
    }),

  // Reject waste submission
  rejectWasteSubmission: adminProcedure
    .input(
      z.object({
        wasteDisposalId: z.string().cuid(),
        reason: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.wasteDisposal.update({
        where: { id: input.wasteDisposalId },
        data: {
          status: "REJECTED",
          adminNotes: input.reason,
          rejectedAt: new Date(),
        },
        include: {
          user: true,
          wasteCategory: true,
        },
      });

      // TODO: Send notification to user about rejection

      return updated;
    }),

  // Get all users with filtering
  getAllUsers: adminProcedure
    .input(
      z.object({
        role: z
          .enum(["USER", "WASTE_MANAGER", "ADMIN", "SUPER_ADMIN"])
          .optional(),
        isActive: z.boolean().optional(),
        search: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input.role && { role: input.role }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.search && {
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
          take: input.limit,
          skip: input.offset,
        }),
        ctx.db.user.count({ where }),
      ]);

      return { users, total };
    }),

  // Update user role
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        role: z.enum(["USER", "WASTE_MANAGER", "ADMIN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Prevent changing own role
      if (input.userId === ctx.session.user.id) {
        throw new Error("Cannot change your own role");
      }

      // Prevent promoting to SUPER_ADMIN (only super admins can do this)
      if (input.role === "SUPER_ADMIN") {
        throw new Error("Cannot promote to super admin");
      }

      return ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
    }),

  // Toggle user active status
  toggleUserStatus: adminProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Prevent deactivating own account
      if (input.userId === ctx.session.user.id) {
        throw new Error("Cannot deactivate your own account");
      }

      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: { isActive: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return ctx.db.user.update({
        where: { id: input.userId },
        data: { isActive: !user.isActive },
      });
    }),

  // Get waste categories
  getWasteCategories: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.wasteCategory.findMany({
      orderBy: { name: "asc" },
    });
  }),

  // Create waste category
  createWasteCategory: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
        pointsPerUnit: z.number().positive(),
        color: z
          .string()
          .regex(/^#[0-9A-F]{6}$/i)
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.wasteCategory.create({
        data: input,
      });
    }),

  // Update waste category
  updateWasteCategory: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        pointsPerUnit: z.number().positive().optional(),
        color: z
          .string()
          .regex(/^#[0-9A-F]{6}$/i)
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.wasteCategory.update({
        where: { id },
        data,
      });
    }),

  // Delete waste category
  deleteWasteCategory: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if category is being used
      const usageCount = await ctx.db.wasteDisposal.count({
        where: { wasteCategoryId: input.id },
      });

      if (usageCount > 0) {
        throw new Error("Cannot delete category that is being used");
      }

      return ctx.db.wasteCategory.delete({
        where: { id: input.id },
      });
    }),

  // Get reward categories
  getRewardCategories: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.rewardCategory.findMany({
      orderBy: { name: "asc" },
    });
  }),

  // Create reward category
  createRewardCategory: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
        color: z
          .string()
          .regex(/^#[0-9A-F]{6}$/i)
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.rewardCategory.create({
        data: input,
      });
    }),

  // Update reward category
  updateRewardCategory: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        color: z
          .string()
          .regex(/^#[0-9A-F]{6}$/i)
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.rewardCategory.update({
        where: { id },
        data,
      });
    }),

  // Delete reward category
  deleteRewardCategory: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if category is being used
      const usageCount = await ctx.db.reward.count({
        where: { categoryId: input.id },
      });

      if (usageCount > 0) {
        throw new Error("Cannot delete category that is being used");
      }

      return ctx.db.rewardCategory.delete({
        where: { id: input.id },
      });
    }),
});
