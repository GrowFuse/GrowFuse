import type { ColumnType } from "kysely";
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type member_roles = {
  role_id: string;
  organization_member_id: string;
};
export type organization = {
  id: Generated<string>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
  name: string;
};
export type organization_member = {
  id: Generated<string>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
  user_id: string;
  organization_id: string;
};
export type permission = {
  id: Generated<string>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
  name: string;
};
export type role = {
  id: Generated<string>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
  name: string;
  organization_id: string;
};
export type role_permission = {
  role_id: string;
  permission_id: string;
};
export type user = {
  id: Generated<string>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
  name: string;
  email: string | null;
  username: string | null;
  image: string | null;
  github_id: number | null;
};
export type user_session = {
  id: Generated<string>;
  expires_at: Timestamp;
  user_id: string;
};
export type DB = {
  member_roles: member_roles;
  organization: organization;
  organization_member: organization_member;
  permission: permission;
  role: role;
  role_permission: role_permission;
  user: user;
  user_session: user_session;
};
