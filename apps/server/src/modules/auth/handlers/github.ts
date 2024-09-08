import { db } from "db";
import { authFactory } from "../index";
import { OAuth2RequestError } from "arctic";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { env } from "env";
import {
  getGitHubUser,
  validateAuthorizationCode,
} from "auth/github";
import { createSession, createSessionCookie } from "auth";

export const githubCallback = authFactory.createHandlers(async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const storedState = getCookie(c, "github_oauth_state") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    throw new HTTPException(400);
  }

  try {
    const githubTokens = await validateAuthorizationCode(code);
    const githubUser = await getGitHubUser(githubTokens.accessToken);

    // Replace this with your own DB client.
    let user = await db
      .selectFrom("user")
      .select(["user.id"])
      .where("user.github_id", "==", githubUser.id)
      .executeTakeFirst();

    if (!user) {
      user = await db
        .insertInto("user")
        .values({
          name: githubUser.name ?? "",
          github_id: githubUser.id,
          username: githubUser.login,
          email: githubUser.email ?? undefined,
          image: githubUser.avatar_url,
          updated_at: new Date(),
        })
        .returning(["id"])
        .executeTakeFirstOrThrow();
    }

    const session = await createSession(user.id);
    createSessionCookie(c, session.id);

    return c.redirect(
      env.NODE_ENV === "production"
        ? "https://dash.growfuse.app"
        : "http://localhost:5173",
    );
  } catch (e) {
    if (e instanceof OAuth2RequestError) throw new HTTPException(400);
    throw new HTTPException(500);
  }
});
