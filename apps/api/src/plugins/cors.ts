import { cors } from "@elysiajs/cors";
import type { ApiEnv } from "../../../../packages/config/src/index";

export const createCorsPlugin = (env: ApiEnv) =>
  cors({
    origin: [env.WEB_APP_URL],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-recycly-user-id",
      "x-recycly-active-role",
      "x-recycly-roles",
      "x-workos-session-id",
    ],
  });
