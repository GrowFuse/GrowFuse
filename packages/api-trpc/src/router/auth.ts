import { setCookie } from "hono/cookie";
import { createTRPCRouter, publicProcedure } from "#index";
import { createAuthorizationURL } from "auth/github";
import { generateState } from "arctic";

export const authRouter = createTRPCRouter({
  getGitHubLoginUrl: publicProcedure.mutation(async ({ ctx: { c } }) => {
    const state = generateState();
    const url = await createAuthorizationURL(state);

    setCookie(c, "github_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    return url;
  }),
});
