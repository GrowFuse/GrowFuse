import { createBlankSessionCookie, validateSession } from "auth";
import type { Context } from "context";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const authenticated = createMiddleware<Context>(async (c, next) => {
  c.set("roles", null);
  const { user, session } = await validateSession(c);

  if (!user || !session) {
    c.set("user", null);
    c.set("session", null);
    createBlankSessionCookie(c);
    throw new HTTPException(401);
  }

  c.set("user", user);
  c.set("session", session);

  await next();
});
