import type { User, Session } from "lucia";

type Role = {
  role: string;
  permissions: Array<string>;
};

export interface Context {
  Variables: {
    user: User | null;
    session: Session | null;
    roles: Array<Role> | null;
  };
}
