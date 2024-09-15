import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { env } from "~/env";
import { db } from "~/server/db";
import { sessionTable, userTable } from "~/server/db/schema";

const adapter: DrizzlePostgreSQLAdapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable,
  userTable,
);

export class AuthService {
  private _lucia = new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        domain: env.NODE_ENV === "production" ? ".growfuse.app" : undefined,
      },
      expires: true,
    },
    getUserAttributes: (user) => user,
  });

  private _getSessionId() {
    return cookies().get(this._lucia.sessionCookieName)?.value ?? null;
  }

  async createSession(userId: string) {
    return this._lucia.createSession(userId, {});
  }

  createSessionCookie(sessionId: string) {
    const sessionCookie = this._lucia.createSessionCookie(sessionId);
    return cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  invalidateSession() {
    const sessionCookie = this._lucia.createBlankSessionCookie();
    return cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  createBlankSessionCookie() {
    const blankSession = this._lucia.createBlankSessionCookie();
    return cookies().set(
      blankSession.name,
      blankSession.value,
      blankSession.attributes,
    );
  }

  async validateSession() {
    const sessionId = this._getSessionId();

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await this._lucia.validateSession(sessionId);
    try {
      if (!result.session?.fresh) this.invalidateSession();
      else this.createSessionCookie(result.session.id);
    } catch (e) {
      console.log(e);
    }

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
