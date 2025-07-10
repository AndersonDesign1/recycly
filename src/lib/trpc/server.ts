import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { hasPermission, hasHigherRole } from "@/lib/utils/roles";

export const createTRPCContext = async () => {
  const headersList = await headers();

  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: headersList,
  });

  // Get user with role if session exists
  let user = null;
  if (session?.user?.id) {
    try {
      // Cast db to any to avoid Prisma extension type conflicts
      const prismaClient = db as any;
      user = await prismaClient.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatarUrl: true,
          points: true,
          level: true,
          isActive: true,
        },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  return {
    db,
    session,
    user,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Authentication middleware
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  });
});

// Role-based middleware
const enforceUserRole = (requiredRole: UserRole) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user || !ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (
      !hasHigherRole(ctx.user.role, requiredRole) &&
      ctx.user.role !== requiredRole
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This action requires ${requiredRole} role or higher`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        user: ctx.user,
      },
    });
  });

// Permission-based middleware
const enforcePermission = (permission: string) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user || !ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (!hasPermission(ctx.user.role, permission)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This action requires '${permission}' permission`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        user: ctx.user,
      },
    });
  });

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
export const wasteManagerProcedure = t.procedure.use(
  enforceUserRole(UserRole.WASTE_MANAGER)
);
export const adminProcedure = t.procedure.use(enforceUserRole(UserRole.ADMIN));
export const superAdminProcedure = t.procedure.use(
  enforceUserRole(UserRole.SUPER_ADMIN)
);

// Permission-based procedures
export const manageUsersProcedure = t.procedure.use(
  enforcePermission("manage_users")
);
export const manageWasteBinsProcedure = t.procedure.use(
  enforcePermission("manage_waste_bins")
);
export const verifyDisposalsProcedure = t.procedure.use(
  enforcePermission("verify_disposals")
);
export const manageRewardsProcedure = t.procedure.use(
  enforcePermission("manage_rewards")
);
export const viewAnalyticsProcedure = t.procedure.use(
  enforcePermission("view_analytics")
);
