import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

export const db = connectionString
  ? drizzle(new Pool({ connectionString }))
  : null;
