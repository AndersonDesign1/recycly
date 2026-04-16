import type { ApiEnv } from "@recycly/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const createDatabase = (env: ApiEnv) => {
  const client = postgres(env.DATABASE_URL, {
    max: 1,
    prepare: false,
  });

  return drizzle({
    client,
    casing: "snake_case",
  });
};
