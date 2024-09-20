// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  boolean,
  pgTableCreator,
  integer,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { TimeSpan } from "lucia";
import { createDate } from "oslo";

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
  githubId: integer("github_id").unique(),
  name: text("name"),
  email: text("email").unique(),
  username: text("username").unique(),
  image: text("image"),
  emailVerified: boolean("email_verified").notNull().default(false),
  passwordHash: text("password_hash"),
});

export const emailVerificationCodeTable = createTable(
  "email_verification_code",
  {
    id: serial("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" })
      .notNull()
      .$defaultFn(() => createDate(new TimeSpan(15, "m"))),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
    email: text("email"),
    code: text("code"),
  },
);

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
