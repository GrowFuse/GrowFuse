import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // url: env.DATABASE_URL,
    database: env.POSTGRES_DB,
    port: 5432,
    host: env.NODE_ENV === "production" ? "" : env.POSTGRES_HOST,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    ssl: env.NODE_ENV === "production" ? true : false,
  },
  tablesFilter: ["growfuse_*"],
} satisfies Config;
