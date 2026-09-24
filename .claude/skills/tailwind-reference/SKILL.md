---
name: tailwind-reference
description: Reference for Tailwind CSS v4 in apps/client. Use when touching styles.css, className utilities, or theme tokens.
---

# Tailwind v4 reference

This repo is on Tailwind **v4** (not v3) — architecture changed significantly:

- **No `tailwind.config.ts`.** Config lives in CSS itself via `@theme` in
  `apps/client/src/styles.css`, which currently is just `@import "tailwindcss";`.
- Vite integration is the `@tailwindcss/vite` plugin (see `vite.config.ts`),
  not PostCSS + autoprefixer.
- To add custom design tokens (colors, fonts, spacing), extend the CSS file:

```css
@import "tailwindcss";

@theme {
  --color-brand: oklch(0.6 0.2 250);
  --font-display: "Inter", sans-serif;
}
```

then use them as normal utilities: `bg-brand`, `font-display`.

- Arbitrary values still work the same: `w-[137px]`.
- `@apply` still works inside CSS files.
- v4 dropped some deprecated utilities from v3 (e.g. `bg-opacity-*` in favor
  of `bg-black/50` slash syntax) — if a v3 snippet doesn't apply, check for
  the slash-opacity or renamed-utility equivalent before assuming it's broken.

## When this isn't enough

No official `llms.txt` for Tailwind as of this writing — fetch
`https://tailwindcss.com/docs/<topic>` directly (HTML, will be converted to
markdown) or search "tailwindcss v4 <topic>".
