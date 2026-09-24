---
name: tanstack-router-reference
description: Reference for TanStack Router (file-based routing in apps/client). Use when adding routes under apps/client/src/routes, touching main.tsx router setup, or writing loaders/guards.
---

# TanStack Router reference

File-based routing, `apps/client/src/routes/*.tsx`, generated route tree at
`apps/client/src/routeTree.gen.ts` (gitignored, regenerated automatically by
the `@tanstack/router-plugin` Vite plugin on `pnpm dev` / `pnpm build` —
**never hand-edit it, don't commit it**).

## Adding a route

A new file `src/routes/foo.tsx` becomes `/foo` automatically:

```ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/foo")({
  component: FooPage,
});
```

- Nested/dynamic: `src/routes/posts.$postId.tsx` -> `/posts/:postId`, read via `Route.useParams()`.
- Layout route: `__root.tsx` wraps everything (nav, providers) via `<Outlet />`.

## Protected routes (this repo's pattern)

See `apps/client/src/routes/dashboard.tsx`:

```ts
export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data) throw redirect({ to: "/login" });
  },
  component: DashboardPage,
});
```

## Data loading

`loader: async ({ params }) => ...` + `Route.useLoaderData()` for
route-driven fetching; this repo instead fetches inside components with
React Query (see tanstack-query-reference skill) since data depends on
mutable session state, not just the URL.

## When this isn't enough

Fetch `https://tanstack.com/router/latest/llms.txt` for the doc index
(getting started, file-based routing, search params, SSR, auth guards), then
the specific page.
