---
name: biome-reference
description: Reference for Biome (lint + format) in this repo. Use when editing biome.json, fixing lint errors, or explaining a Biome diagnostic.
---

# Biome reference

Single `biome.json` at the repo root covers every workspace (`vcs.useIgnoreFile`
respects `.gitignore` too). Double quotes, semicolons always, trailing commas,
2-space indent, 100 char line width — see `biome.json` for the exact config.

## Commands (root scripts)

```bash
pnpm check    # biome check --write .   (format + lint + organize imports, autofix)
pnpm lint     # biome lint .            (lint only, no write)
pnpm format   # biome format --write .  (format only)
```

Run `pnpm check` before committing — it fixes import order and formatting in
one pass, which is most of what Biome flags day to day.

## Suppressing a rule inline

```ts
// biome-ignore lint/a11y/noLabelWithoutControl: htmlFor passed in via ...props at call sites
```

Always include the reason after the colon — see `components/ui/label.tsx`
for the one existing example in this repo.

## Ignoring a path

Add to `biome.json`'s `files.ignore` array — already excludes `dist`,
`node_modules`, generated `routeTree.gen.ts`, and `apps/server/drizzle`
(generated migrations).

## When this isn't enough

No official `llms.txt` for Biome as of this writing — fetch
`https://biomejs.dev/linter/rules/<rule-name>` for a specific rule, or
`https://biomejs.dev/reference/configuration/` for config schema.
