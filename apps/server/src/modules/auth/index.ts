import { createFactory } from "hono/factory";
import { githubCallback } from "./handlers/github";

export const authFactory = createFactory();
const authApp = authFactory.createApp();
authApp.post("/callback/github", ...githubCallback);

export default authApp;
