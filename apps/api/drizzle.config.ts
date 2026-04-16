import { loadApiEnv } from "@recycly/config";
import { defineConfig } from "drizzle-kit";

const env = loadApiEnv(process.env);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
