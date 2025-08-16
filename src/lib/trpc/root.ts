import { createTRPCRouter } from "@/src/lib/trpc/server"
import { userRouter } from "@/src/lib/trpc/routers/user"
import { wasteBinRouter } from "@/src/lib/trpc/routers/waste-bin"
import { wasteDisposalRouter } from "@/src/lib/trpc/routers/waste-disposal"

export const appRouter = createTRPCRouter({
  user: userRouter,
  wasteBin: wasteBinRouter,
  wasteDisposal: wasteDisposalRouter,
})

export type AppRouter = typeof appRouter
