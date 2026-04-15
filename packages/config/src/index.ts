import { z } from "zod";

const apiEnvSchema = z.object({
  API_HOST: z.string().default("127.0.0.1"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_BASE_URL: z.string().url().default("http://127.0.0.1:4000"),
  WEB_APP_URL: z.string().url().default("http://127.0.0.1:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
  WORKOS_CLIENT_ID: z.string().min(1, "WORKOS_CLIENT_ID is required."),
  WORKOS_API_KEY: z.string().min(1, "WORKOS_API_KEY is required."),
  WORKOS_COOKIE_PASSWORD: z
    .string()
    .min(32, "WORKOS_COOKIE_PASSWORD must be at least 32 characters."),
  NEXT_PUBLIC_WORKOS_REDIRECT_URI: z
    .string()
    .url()
    .default("http://127.0.0.1:3000/auth/callback"),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

export const loadApiEnv = (input: Record<string, string | undefined>): ApiEnv =>
  apiEnvSchema.parse(input);
