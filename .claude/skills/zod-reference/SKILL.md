---
name: zod-reference
description: Reference for Zod v4 schema validation. Use when writing or editing schemas in packages/shared/src/schemas, or any z.object/z.string validation in this repo.
---

# Zod v4 reference

This repo is on Zod **v4** (not v3) everywhere — `packages/shared`,
`apps/server`, `apps/client` all pin `"zod": "^4.0.0"`. v4 changed some APIs
from v3; don't paste v3-era patterns without checking.

## What's used in this repo

`packages/shared/src/schemas/auth.ts`:

```ts
export const loginSchema = z.object({
  email: z.string().email("Gecerli bir e-posta girin"),
  password: z.string().min(8, "Sifre en az 8 karakter olmali"),
});
export type LoginInput = z.infer<typeof loginSchema>;
```

Consumed on the client via `@hookform/resolvers/zod`'s `zodResolver`, and
would be consumed on the server the same way (`schema.parse(await c.req.json())`)
if a route needs body validation.

## v4 notes worth knowing

- Top-level string formats now also exist as standalone: `z.email()`,
  `z.url()`, `z.uuid()` — equivalent to `.email()`/`.url()` chained methods,
  which still work too.
- Error customization moved to a single `error` param instead of separate
  `message`/`invalid_type_error`/`required_error`: `z.string({ error: "..." })`.
- `z.infer<typeof schema>` is unchanged.
- `@hono/zod-openapi` ^1.x requires zod v4 as a peer — don't downgrade zod
  without also downgrading that package (see hono-reference skill).

## When this isn't enough

Fetch `https://zod.dev/llms.txt` for the doc index, then the specific page.
