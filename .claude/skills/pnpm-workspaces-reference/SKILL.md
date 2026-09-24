---
name: pnpm-workspaces-reference
description: Reference for this repo's pnpm workspace layout. Use when adding a package, wiring a new workspace dependency, or writing a root script that should target one app.
---

# pnpm workspaces reference

`pnpm-workspace.yaml`: `apps/*` and `packages/*`. Three packages today:
`client`, `server`, `@repo/shared`.

## Running a script in one workspace

```bash
pnpm --filter server dev
pnpm --filter client build
pnpm --filter @repo/shared <script>   # scoped package needs its full name
```

Root `package.json` scripts are thin wrappers around this (`dev:all` is
`pnpm -r --parallel run dev` — runs every workspace package's `dev` script,
here client's `vite` and server's `tsx watch`, at once with prefixed output;
no extra process-runner dependency needed).

## Depending on a workspace package

```json
{ "dependencies": { "@repo/shared": "workspace:*" } }
```

`workspace:*` resolves to the local package via a symlink in `node_modules`,
not the npm registry — never publish a real semver range for internal packages.

## `packages/shared`'s no-build setup

Its `package.json` points `main`/`exports` straight at `./src/index.ts` (raw
TypeScript, no build step). This works because every consumer's toolchain
already transpiles TS via esbuild — Vite (client), tsx (server dev), and
tsup with `noExternal: [/^@repo\//]` (server build, see
`apps/server/tsup.config.ts`) all handle it. If you ever add a workspace
package consumed by a tool that does NOT transpile TS on the fly, give that
package a real build step instead of copying this pattern blindly.

## When this isn't enough

pnpm has no official `llms.txt`. Fetch `https://pnpm.io/workspaces` or
`https://pnpm.io/cli/<command>` directly for anything beyond this.
