import { Kysely, PostgresDialect, type ColumnType } from "kysely";
import { Pool } from "pg";
import type { DB, Generated } from "./types.ts"; // this is the Database interface we defined earlier

export const pool = new Pool({
  database: Bun.env.POSTGRES_DB,
  host: Bun.env.POSTGRES_DB || "localhost",
  user: Bun.env.POSTGRES_USER,
  password: Bun.env.POSTGRES_PASSWORD,
  port: 5434,
  max: 10,
});

const dialect = new PostgresDialect({
  pool,
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});

export type Normalize<T> =
  T extends ColumnType<infer S> ? S : T extends Generated<infer G> ? G : T;

export type NormalizeObject<T> = {
  [K in keyof T]: Normalize<T[K]>;
};

export type NormalizedDB = {
  [K in keyof DB]: NormalizeObject<DB[K]>;
};
