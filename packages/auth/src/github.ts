import { GitHub } from "arctic";

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  email: string | null;
}

const _github: GitHub = new GitHub(
  Bun.env.GITHUB_CLIENT_ID!,
  Bun.env.GITHUB_CLIENT_SECRET!,
);
const _githubApiUrl = "https://api.github.com";

export async function createAuthorizationURL(state: string) {
  return await _github.createAuthorizationURL(state);
}

export async function validateAuthorizationCode(code: string) {
  return await _github.validateAuthorizationCode(code);
}

export async function getGitHubUser(token: string): Promise<GitHubUser> {
  return (await (
    await fetch(`${_githubApiUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).json()) satisfies GitHubUser;
}
