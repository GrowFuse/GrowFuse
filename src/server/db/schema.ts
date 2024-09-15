// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { pgTableCreator, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `growfuse_${name}`);

const baseFields = {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .$onUpdateFn(() => new Date()),
};

export const userTable = createTable("user", {
  ...baseFields,
  id: text("id").primaryKey(),
});

export const sessionTable = createTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
