import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/server/db/schema";

declare global {
  var recyclyPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? globalThis.recyclyPool ??
    new Pool({
      connectionString,
      max: 10,
    })
  : null;

if (process.env.NODE_ENV !== "production" && pool) {
  globalThis.recyclyPool = pool;
}

export const db = pool ? drizzle(pool, { schema }) : null;

export type Db = typeof db;
