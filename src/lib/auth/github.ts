import { GitHub } from "arctic";
import axios from "axios";
import { env } from "~/env";

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
    this._github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);
  }

  async createAuthorizationURL(state: string) {
    return await this._github.createAuthorizationURL(state);
  }

  async validateAuthorizationCode(code: string) {
    return await this._github.validateAuthorizationCode(code);
  }

  async getGitHubUser(token: string) {
    return (
      await axios.get<GitHubUser>(`${this._githubApiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data;
  }
}
