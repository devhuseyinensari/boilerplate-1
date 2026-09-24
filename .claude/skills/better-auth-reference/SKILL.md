---
name: better-auth-reference
description: Reference for better-auth (email/password auth in this repo). Use when touching apps/server/src/auth.ts, apps/server/src/db/schema.ts, apps/client/src/lib/auth-client.ts, or any login/register/session flow.
---

# better-auth reference

This repo uses better-auth ^1.7 with the Drizzle adapter (Postgres) and only
`emailAndPassword` enabled — no OAuth/social providers.

## Server (`apps/server/src/auth.ts`)

```ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.CLIENT_URL],
  secret: env.BETTER_AUTH_SECRET,
});
```

Mounted in `index.ts` as a catch-all: `app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw))`.

Common `emailAndPassword` options worth knowing: `minPasswordLength`,
`maxPasswordLength`, `requireEmailVerification`, `sendResetPassword`.

## Schema (`apps/server/src/db/schema.ts`)

Four tables better-auth expects: `user`, `session`, `account`, `verification`.
If you enable a new plugin (2FA, magic link, organizations, etc.) it likely
needs extra columns/tables — run `npx @better-auth/cli generate` to get the
exact Drizzle schema diff for whatever's enabled, then `pnpm db:generate`.

## Client (`apps/client/src/lib/auth-client.ts`)

```ts
export const authClient = createAuthClient(); // same-origin, no baseURL needed
export const { signIn, signUp, signOut, useSession } = authClient;
```

- `signIn.email({ email, password })`, `signUp.email({ email, password, name })` — both return `{ data, error }`, never throw.
- `useSession()` — reactive hook for the current session (used for UI state).
- `authClient.getSession()` — one-shot promise version (used in `dashboard.tsx`'s `beforeLoad` route guard).

## When this isn't enough

Fetch `https://www.better-auth.com/llms.txt` for the doc index. Their pages
are served as clean Markdown by appending `.md` to any docs URL, e.g.
`https://www.better-auth.com/docs/plugins/two-factor.md`.
