import { initTRPC, TRPCError } from "@trpc/server"
import type { CreateNextContextOptions } from "@trpc/server/adapters/next"
import superjson from "superjson"
import { ZodError } from "zod"
import { auth } from "../auth"
import { prisma } from "../prisma"
import { hasPermission } from "../auth"

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') {
      headers.append(key, value);
    } else if (Array.isArray(value)) {
      for (const v of value) {
        headers.append(key, v);
      }
    }
  }

  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: headers,
  });

  return {
    prisma,
    session,
    req,
    res,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!hasPermission(ctx.session.user.role || "USER", ["ADMIN", "SUPERADMIN"])) {
    throw new TRPCError({ code: "FORBIDDEN" })
  }
  return next({ ctx })
})

export const superAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!hasPermission(ctx.session.user.role || "USER", ["SUPERADMIN"])) {
    throw new TRPCError({ code: "FORBIDDEN" })
  }
  return next({ ctx })
})

export const wasteManagerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!hasPermission(ctx.session.user.role || "USER", ["WASTE_MANAGER", "ADMIN", "SUPERADMIN"])) {
    throw new TRPCError({ code: "FORBIDDEN" })
  }
  return next({ ctx })
})
