import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import authApp from "~/modules/auth";
import { appRouter } from "api-trpc/router";
import { createContext } from "api-trpc/context";
import { db } from "db";
import { cors } from "hono/cors";

// load .env and verify
await import("~/env");

const app = new Hono();

app.use(cors());

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
