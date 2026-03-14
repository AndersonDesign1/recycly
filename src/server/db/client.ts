import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

declare global {
  var recyclyPool: Pool | undefined;
}

const globalForDb = globalThis as typeof globalThis & {
  recyclyPool?: Pool;
};

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? (globalForDb.recyclyPool ??
    new Pool({
      connectionString,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30_000,
      max: 10,
      maxUses: 7500,
    }))
  : null;

if (process.env.NODE_ENV !== "production" && pool) {
  globalForDb.recyclyPool = pool;
}

export const db = pool ? drizzle(pool) : null;
export const dbPool = pool;

export type Db = typeof db;
