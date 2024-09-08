import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { Lucia } from "lucia";
import { pool } from "db";
import { getCookie, setCookie } from "hono/cookie";
import type { Context } from "hono";

const adapter = new NodePostgresAdapter(pool, {
  user: "user",
  session: "user_session",
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: Bun.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      domain: Bun.env.NODE_ENV === "production" ? ".growfuse.app" : undefined,
    },
    expires: true,
  },
  getUserAttributes: (user) => user,
});

function getSessionId(c: Context) {
  return getCookie(c, lucia.sessionCookieName) ?? null;
}

export async function createSession(userId: string) {
  return lucia.createSession(userId, {});
}

export function createSessionCookie(c: Context, sessionId: string) {
  const sessionCookie = lucia.createSessionCookie(sessionId);
  return setCookie(
    c,
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export function invalidateSession(c: Context) {
  const sessionCookie = lucia.createBlankSessionCookie();
  return setCookie(
    c,
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export function createBlankSessionCookie(c: Context) {
  const blankSession = lucia.createBlankSessionCookie();
  return setCookie(
    c,
    blankSession.name,
    blankSession.value,
    blankSession.attributes,
  );
}

export async function validateSession(c: Context) {
  const sessionId = getSessionId(c);

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  try {
    if (!result.session?.fresh) invalidateSession(c);
    else createSessionCookie(c, result.session.id);
  } catch {}

  return result;
}

// IMPORTANT!
interface DatabaseUserAttributes {
  name: string;
  image: string;
  github_id: number;
  username: string | null;
  email: string | null;
}

declare module "lucia" {
  interface Register {
    Lucia: Lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
