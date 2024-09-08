import { Hono } from "hono";

// load .env and verify
await import("env");

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello world!\nLet's f*****g go!!!");
});

export default app;
