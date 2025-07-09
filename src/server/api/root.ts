import { createTRPCRouter, publicProcedure } from "../../lib/trpc/server";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return "OK";
  }),
});

export type AppRouter = typeof appRouter;
