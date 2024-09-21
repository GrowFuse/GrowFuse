import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const conn =
  globalForDb.conn ??
  postgres({
    password: env.POSTGRES_PASSWORD,
    user: env.POSTGRES_USER,
    database: env.POSTGRES_DB,
    host: env.POSTGRES_HOST,
    port: 5432,
    ssl: env.NODE_ENV === "production" ? true : false,
  });

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
