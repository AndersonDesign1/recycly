import { defineConfig } from "drizzle-kit";
import { loadDatabaseEnv } from "../../packages/config/src/index";

const env = loadDatabaseEnv(process.env);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
