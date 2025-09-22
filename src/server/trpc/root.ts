import { router } from "@/server/trpc";
import { adminRouter } from "./routers/admin";
import { rewardRouter } from "./routers/reward";
import { superAdminRouter } from "./routers/superAdmin";
import { userRouter } from "./routers/user";
import { wasteRouter } from "./routers/waste";

export const appRouter = router({
  user: userRouter,
  waste: wasteRouter,
  reward: rewardRouter,
  admin: adminRouter,
  superAdmin: superAdminRouter,
});

export type AppRouter = typeof appRouter;
