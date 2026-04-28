import { loadDatabaseEnv } from "@recycly/config";
import { defineConfig } from "drizzle-kit";

const env = loadDatabaseEnv(process.env);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
