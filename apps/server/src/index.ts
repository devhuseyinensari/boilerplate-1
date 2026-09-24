import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "./auth";
import { env } from "./env";
import { usersRoute } from "./routes/users";

const app = new OpenAPIHono();

app.use(secureHeaders());

app.get("/health", (c) => c.json({ status: "ok" }));

app.use(
  "/api/*",
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.route("/api", usersRoute);

app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: { title: "API", version: "0.0.0" },
});

app.get("/reference", apiReference({ url: "/openapi.json" }));

if (env.NODE_ENV === "production") {
  app.use("/*", serveStatic({ root: "./public" }));
  app.get("*", serveStatic({ path: "./public/index.html" }));
}

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.info(`server up on http://localhost:${info.port}`);
  console.info(`docs at http://localhost:${info.port}/reference`);
});
