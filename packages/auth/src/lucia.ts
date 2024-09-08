import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { Lucia } from "lucia";
import { pool } from "@growfuse/db";
import { getCookie, setCookie } from "hono/cookie";
import type { Context } from "hono";

const adapter = new NodePostgresAdapter(pool, {
  user: "user",
  session: "user_session",
});

export class AuthService {
  private _lucia = new Lucia(adapter, {
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

  private _getSessionId(c: Context) {
    return getCookie(c, this._lucia.sessionCookieName) ?? null;
  }

  async createSession(userId: string) {
    return this._lucia.createSession(userId, {});
  }

  createSessionCookie(c: Context, sessionId: string) {
    const sessionCookie = this._lucia.createSessionCookie(sessionId);
    return setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  invalidateSession(c: Context) {
    const sessionCookie = this._lucia.createBlankSessionCookie();
    return setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  createBlankSessionCookie(c: Context) {
    const blankSession = this._lucia.createBlankSessionCookie();
    return setCookie(
      c,
      blankSession.name,
      blankSession.value,
      blankSession.attributes,
    );
  }

  async validateSession(c: Context) {
    const sessionId = this._getSessionId(c);

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await this._lucia.validateSession(sessionId);
    try {
      if (!result.session?.fresh) this.invalidateSession(c);
      else this.createSessionCookie(c, result.session.id);
    } catch {}

    return result;
  }
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
