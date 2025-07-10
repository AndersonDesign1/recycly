import { createTRPCRouter } from "@/lib/trpc/server"
import { userRouter } from "@/lib/trpc/routers/user"
import { wasteBinRouter } from "@/lib/trpc/routers/waste-bin"
import { wasteDisposalRouter } from "@/lib/trpc/routers/waste-disposal"

export const appRouter = createTRPCRouter({
  user: userRouter,
  wasteBin: wasteBinRouter,
  wasteDisposal: wasteDisposalRouter,
})

export type AppRouter = typeof appRouter
