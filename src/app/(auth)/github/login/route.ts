import { generateState } from "arctic";
import { cookies } from "next/headers";
import { ServiceLocator } from "~/lib/service-locator";

export async function GET(): Promise<Response> {
  const state = generateState();
  const githubAuthService = ServiceLocator.getService("GitHubAuthService");
  const url = await githubAuthService.createAuthorizationURL(state);

  cookies().set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
