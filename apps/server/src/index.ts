import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import authApp from "modules/auth";
import { appRouter } from "api-trpc";
import { createContext } from "api-trpc/context";
import { db } from "db";

// load .env and verify
await import("env");

const app = new Hono();
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_, c) => createContext(db, c),
  }),
);

app.get("/", (c) => {
  return c.text("Hello world!\nLet's f*****g go!!!");
});

app.route("/api/auth", authApp);

export default app;
