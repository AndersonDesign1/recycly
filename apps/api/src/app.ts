import { type ApiEnv, loadApiEnv } from "@recycly/config";
import { Elysia } from "elysia";
import {
  createPickupRequestModule,
  type PickupRequestModuleOptions,
} from "./modules/pickup-requests";
import { getAuthContext, requireAuth } from "./plugins/auth-context";
import { createCorsPlugin } from "./plugins/cors";
import { errorPlugin } from "./plugins/errors";
import { openApiPlugin } from "./plugins/openapi";

export interface CreateAppOptions {
  env?: ApiEnv;
  pickupRequests?: PickupRequestModuleOptions;
}

export const createApp = (options: CreateAppOptions = {}) => {
  const env = options.env ?? loadApiEnv(process.env);

  return new Elysia({ name: "recycly-api" })
    .decorate("env", env)
    .use(errorPlugin)
    .use(createCorsPlugin(env))
    .use(openApiPlugin)
    .get(
      "/health",
      () => ({
        status: "ok" as const,
        service: "recycly-api" as const,
        runtime: "bun" as const,
        timestamp: new Date().toISOString(),
      }),
      {
        detail: {
          tags: ["System"],
          summary: "Health check",
        },
      }
    )
    .group("/v1", (app) =>
      app
        .get("/me", ({ headers }) => requireAuth(getAuthContext(headers)), {
          detail: {
            tags: ["Auth"],
            summary: "Inspect the authenticated session",
          },
        })
        .use(createPickupRequestModule(options.pickupRequests))
    );
};

export type RecyclyApi = ReturnType<typeof createApp>;
