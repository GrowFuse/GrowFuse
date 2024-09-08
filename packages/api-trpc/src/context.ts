import type { db as dbClient } from "db";
import { validateSession } from "auth";
import type { Context as HonoContext } from "hono";

export async function createContext(db: typeof dbClient, c: HonoContext) {
  const { user } = await validateSession(c);
  return { user, db, c };
}
