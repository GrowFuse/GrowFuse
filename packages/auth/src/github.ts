import { GitHub } from "arctic";

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  email: string | null;
}

export class GitHubAuthService {
  private _github: GitHub;
  private _githubApiUrl = "https://api.github.com";

  constructor() {
    this._github = new GitHub(
      Bun.env.GITHUB_CLIENT_ID!,
      Bun.env.GITHUB_CLIENT_SECRET!,
    );
  }

  async createAuthorizationURL(state: string) {
    return await this._github.createAuthorizationURL(state);
  }

  async validateAuthorizationCode(code: string) {
    return await this._github.validateAuthorizationCode(code);
  }

  async getGitHubUser(token: string): Promise<GitHubUser> {
    return (await (
      await fetch(`${this._githubApiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).json()) satisfies GitHubUser;
  }
}
