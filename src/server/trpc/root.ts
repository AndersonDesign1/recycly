import { router } from "@/server/trpc";
import { userRouter } from "./routers/user";
import { wasteRouter } from "./routers/waste";
import { rewardRouter } from "./routers/reward";
import { adminRouter } from "./routers/admin";
import { superAdminRouter } from "./routers/superAdmin";

export const appRouter = router({
  user: userRouter,
  waste: wasteRouter,
  reward: rewardRouter,
  admin: adminRouter,
  superAdmin: superAdminRouter,
});

export type AppRouter = typeof appRouter;
