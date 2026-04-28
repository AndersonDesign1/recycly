import type { DatabaseEnv } from "@recycly/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

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
