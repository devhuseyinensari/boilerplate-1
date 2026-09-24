---
name: shadcn-reference
description: Reference for shadcn/ui components in apps/client/src/components/ui. Use when adding, customizing, or theming UI primitives.
---

# shadcn/ui reference

`apps/client/components.json` is already configured (style `default`, no
CSS variables, base color `slate`, aliases `@/components`, `@/lib/utils`,
`@/components/ui`). Only `button`, `input`, `label`, `card` exist so far,
hand-written to match shadcn's own output shape (no network access was
available when this boilerplate was built).

## Adding a new component

Normal shadcn workflow works as-is:

```bash
cd apps/client
npx shadcn@latest add dialog
```

This respects `components.json` and drops the file straight into
`src/components/ui/`, matching the existing primitives' conventions:

- Function component, not `forwardRef`-wrapped unless the primitive needs a
  ref (shadcn's Radix-based components usually do — keep that if the CLI
  generates it).
- Props extend the native HTML element's attributes type.
- Styling via `cn(...)` from `@/lib/utils` (clsx + tailwind-merge), variants
  via `class-variance-authority` (see `button.tsx`).

## When this isn't enough

Fetch `https://ui.shadcn.com/llms.txt` for the doc index (CLI, theming,
components.json, dark mode, registry), then the specific page.
