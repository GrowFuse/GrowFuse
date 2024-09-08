import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "./types.ts"; // this is the Database interface we defined earlier

const dialect = new PostgresDialect({
  pool: new Pool({
    database: Bun.env.POSTGRES_DB,
    host: Bun.env.POSTGRES_DB || "localhost",
    user: Bun.env.POSTGRES_USER,
    password: Bun.env.POSTGRES_PASSWORD,
    port: 5434,
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});
