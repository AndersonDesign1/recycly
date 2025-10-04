import { fetchRouter } from "../../lib/trpc";
import { adminRouter } from "./admin";
import { creditRouter } from "./credit";
import { notificationRouter } from "./notification";
import { userRouter } from "./user";
import { wasteDepositRouter } from "./waste-deposit";
import { wasteManagerRouter } from "./waste-manager";

export const appRouter = fetchRouter({
  user: userRouter,
  wasteDeposit: wasteDepositRouter,
  wasteManager: wasteManagerRouter,
  admin: adminRouter,
  credit: creditRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
