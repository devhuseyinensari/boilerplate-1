---
name: drizzle-reference
description: Reference for Drizzle ORM + drizzle-kit (Postgres) in this repo. Use when touching apps/server/src/db/*, drizzle.config.ts, or writing queries/migrations.
---

# Drizzle ORM reference

drizzle-orm ^0.45 + drizzle-kit ^0.31, `node-postgres` (`pg`) driver, dialect
`postgresql`. Config at `apps/server/drizzle.config.ts`, schema at
`apps/server/src/db/schema.ts`, client at `apps/server/src/db/index.ts`.

## Workflow

```bash
pnpm db:generate   # diff schema.ts -> new SQL file in apps/server/drizzle/
pnpm db:migrate    # apply pending migrations to DATABASE_URL
pnpm db:studio     # visual browser at local.drizzle.studio
```

Never hand-edit a generated migration that's already been applied anywhere —
change `schema.ts` and generate a new one instead.

## Schema basics (pg)

```ts
import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const post = pgTable("post", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

## Queries

```ts
import { eq } from "drizzle-orm";
await db.select().from(post).where(eq(post.authorId, userId));
await db.insert(post).values({ id, title, authorId });
await db.query.post.findMany({ where: eq(post.authorId, userId) }); // relational API, needs relations()
```

## When this isn't enough

Fetch `https://orm.drizzle.team/llms.txt` — indexes every doc page (schema,
migrations, relations, per-database guides, Zod/Valibot integration). Pick
the relevant link and fetch that page.
