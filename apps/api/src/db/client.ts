import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { DatabaseEnv } from "../../../../packages/config/src/index";

export const createDatabase = (env: DatabaseEnv) => {
  const client = postgres(env.DATABASE_URL, {
    max: 1,
    prepare: false,
  });

  return drizzle({
    client,
    casing: "snake_case",
  });
};
