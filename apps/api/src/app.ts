import { Elysia } from "elysia";
import { type ApiEnv, loadApiEnv } from "../../../packages/config/src/index";
import {
  createPickupRequestModule,
  type PickupRequestModuleOptions,
} from "./modules/pickup-requests";
import { getAuthContext, requireAuth } from "./plugins/auth-context";
import { createCorsPlugin } from "./plugins/cors";
import { formatApiError } from "./plugins/errors";
import { openApiPlugin } from "./plugins/openapi";

export interface CreateAppOptions {
  env?: ApiEnv;
  pickupRequests?: PickupRequestModuleOptions;
}

export const createApp = (options: CreateAppOptions = {}) => {
  const env = options.env ?? loadApiEnv(process.env);

  const app = new Elysia({ name: "recycly-api" })
    .decorate("env", env)
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
        .get(
          "/me",
          ({ env, headers }) =>
            requireAuth(
              getAuthContext(headers, env.RECYCLY_INTERNAL_API_TOKEN)
            ),
          {
            detail: {
              tags: ["Auth"],
              summary: "Inspect the authenticated session",
            },
          }
        )
        .use(
          createPickupRequestModule({
            ...options.pickupRequests,
            internalApiToken: env.RECYCLY_INTERNAL_API_TOKEN,
          })
        )
    );

  app.onError(({ code, error, set }) => {
    const { body, status } = formatApiError(code, error);
    set.status = status;
    return body;
  });

  return app;
};

export type RecyclyApi = ReturnType<typeof createApp>;
