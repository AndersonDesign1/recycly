import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { auth } from "./auth";
import { db } from "./db";

// Create context for tRPC (Next.js API routes)
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: new Headers(req.headers as Record<string, string>),
  });

  return {
    db,
    session,
    req,
    res,
  };
};

// Create context type for fetch adapter (without res)
export type FetchContext = {
  db: typeof db;
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  req: Request;
};

// Create context for tRPC (Fetch adapter)
export const createFetchContext = async (opts: { req: Request }): Promise<FetchContext> => {
  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: opts.req.headers,
  });

  return {
    db,
    session,
    req: opts.req,
  };
};

// Initialize tRPC for Next.js API routes
const t = initTRPC.context<typeof createTRPCContext>().create();

// Initialize tRPC for fetch adapter
const tFetch = initTRPC.context<FetchContext>().create();

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Fetch adapter router and procedures
export const fetchRouter = tFetch.router;
export const fetchPublicProcedure = tFetch.procedure;

// Fetch adapter protected procedure (requires authentication)
export const fetchProtectedProcedure = tFetch.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

// Fetch adapter role-based procedures
export const createFetchRoleProcedure = (allowedRoles: string[]) => {
  return fetchProtectedProcedure.use(({ ctx, next }) => {
    if (!allowedRoles.includes(ctx.user.role || '')) {
      throw new TRPCError({ 
        code: "FORBIDDEN",
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}`
      });
    }
    return next({ ctx });
  });
};

// Fetch adapter specific role procedures
export const fetchSuperAdminProcedure = createFetchRoleProcedure(["SUPER_ADMIN"]);
export const fetchAdminProcedure = createFetchRoleProcedure(["SUPER_ADMIN", "ADMIN"]);
export const fetchWasteManagerProcedure = createFetchRoleProcedure(["SUPER_ADMIN", "ADMIN", "WASTE_MANAGER"]);
export const fetchUserProcedure = createFetchRoleProcedure(["SUPER_ADMIN", "ADMIN", "WASTE_MANAGER", "USER"]);

// Protected procedure (requires authentication)
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

// Role-based procedures
export const createRoleProcedure = (allowedRoles: string[]) =>
  protectedProcedure.use(({ ctx, next }) => {
    if (!allowedRoles.includes(ctx.user.role || '')) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
      });
    }
    return next({ ctx });
  });

// Specific role procedures
export const superAdminProcedure = createRoleProcedure(["SUPER_ADMIN"]);
export const adminProcedure = createRoleProcedure(["SUPER_ADMIN", "ADMIN"]);
export const wasteManagerProcedure = createRoleProcedure([
  "SUPER_ADMIN",
  "ADMIN",
  "WASTE_MANAGER",
]);
export const userProcedure = createRoleProcedure([
  "SUPER_ADMIN",
  "ADMIN",
  "WASTE_MANAGER",
  "USER",
]);
