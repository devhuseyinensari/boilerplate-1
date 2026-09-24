---
name: hono-reference
description: Reference for Hono (the server framework in apps/server). Use when adding routes, middleware, or touching apps/server/src/index.ts, auth.ts, or routes/*.ts.
---

# Hono reference

This repo runs Hono ^4.13 on `@hono/node-server`, with `@hono/zod-openapi`'s
`OpenAPIHono` as the app instance (see `apps/server/src/index.ts`) so every
route is also documented at `/reference` (Scalar UI) for free.

## Adding a new route

Prefer `createRoute` + `.openapi()` over plain `app.get(...)` so it shows up
in the docs — see `apps/server/src/routes/users.ts` for the pattern:

```ts
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

const route = createRoute({
  method: "get",
  path: "/thing",
  tags: ["Thing"],
  responses: {
    200: { description: "...", content: { "application/json": { schema: someZodSchema } } },
  },
});

app.openapi(route, async (c) => c.json({ ... }));
```

Mount sub-routers with `app.route("/api", subRouter)`.

## Core APIs

- `c.req.param("id")`, `c.req.query("q")`, `c.req.valid("json")` (with zod validator middleware)
- `c.json(data, status)`, `c.text(...)`, `c.redirect(...)`
- Middleware: `app.use("/path/*", middlewareFn)`; built-ins live under `hono/*` (`hono/cors`, `hono/logger`, `hono/jwt`, `hono/basic-auth`, etc.)
- Get the current session inside a handler: `await auth.api.getSession({ headers: c.req.raw.headers })` (see `routes/users.ts`)

## When this isn't enough

Fetch `https://hono.dev/llms.txt` first — it's a curated index of every doc
page (middleware, helpers, guides, adapters). Pick the relevant link from
there and fetch that page directly.
