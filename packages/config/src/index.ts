import { z } from "zod";

const apiEnvSchema = z.object({
  API_HOST: z.string().default("127.0.0.1"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_BASE_URL: z.string().url().default("http://127.0.0.1:4000"),
  WEB_APP_URL: z.string().url().default("http://127.0.0.1:3000"),
  RECYCLY_INTERNAL_API_TOKEN: z
    .string()
    .min(16, "RECYCLY_INTERNAL_API_TOKEN must be at least 16 characters.")
    .optional(),
});

const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;
export type DatabaseEnv = z.infer<typeof databaseEnvSchema>;

export const loadApiEnv = (input: Record<string, string | undefined>): ApiEnv =>
  apiEnvSchema.parse(input);

export const loadDatabaseEnv = (
  input: Record<string, string | undefined>
): DatabaseEnv => databaseEnvSchema.parse(input);
