import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { ServiceLocator } from "~/lib/service-locator";
import { db } from "~/server/db";
import { userTable } from "~/server/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const githubAuthService = ServiceLocator.getService("GitHubAuthService");
    const authService = ServiceLocator.getService("AuthService");

    const githubTokens =
      await githubAuthService.validateAuthorizationCode(code);
    const githubUser = await githubAuthService.getGitHubUser(
      githubTokens.accessToken,
    );

    let [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.githubId, githubUser.id));

    if (!user) {
      [user] = await db.insert(userTable).values({
        name: githubUser.name ?? "",
        githubId: githubUser.id,
        username: githubUser.login,
        email: githubUser.email,
        image: githubUser.avatar_url,
        emailVerified: true,
      });
      user = user!;
    }

    const session = await authService.createSession(user.id);
    authService.createSessionCookie(session.id);

    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  } catch (e) {
    console.log(e);

    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }

    return new Response(null, {
      status: 500,
    });
  }
}
