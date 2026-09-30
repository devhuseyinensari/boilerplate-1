# Fullstack Boilerplate

pnpm workspaces monorepo. Client (Vite + React + TanStack Router) ve server
(Hono + Drizzle + better-auth) tek Docker imajinda birlikte calisir.

## Icindekiler

- [Stack](#stack)
- [Ilk kurulum checklist'i](#ilk-kurulum-checklisti)
- [Gereksinimler](#gereksinimler)
- [Kurulum](#kurulum)
- [Gelistirme](#gelistirme)
- [Lint & Format](#lint--format)
- [Biome kurallari](#biome-kurallari)
- [Git hook'lari (husky)](#git-hooklari-husky)
- [Docker / Dokploy](#docker--dokploy)
- [Yapi](#yapi)
- [Opsiyonel modulleri kaldirma](#opsiyonel-modulleri-kaldirma)
- [AI agent kurallari ve skill'ler](#ai-agent-kurallari-ve-skiller)

## Stack

- **Monorepo**: pnpm workspaces (`apps/client`, `apps/server`, `apps/landing`, `packages/shared`)
- **Lint/Format**: Biome
- **Client**: TanStack Router, React Query, Zustand, React Hook Form, Zod, Axios, Tailwind v4, shadcn-tarzi componentler
- **Server**: Hono, Drizzle ORM + PostgreSQL, better-auth (email/sifre), `@hono/zod-openapi` + Scalar (API docs)
- **Landing**: Astro (static output) + React islands + Tailwind v4, content collections ile blog — *opsiyonel, bkz. [Opsiyonel modulleri kaldirma](#opsiyonel-modulleri-kaldirma)*

## Ilk kurulum checklist'i

Repoyu yeni klonlayan biri (insan ya da AI agent) icin sirayla:

1. **Editor eklentisi kur** — bu repo formatter/linter olarak sadece Biome
   kullanir, ESLint/Prettier yok:
   - **VS Code**: `biomejs.biome` eklentisini kur (`.vscode/extensions.json`
     acilista onerir, "Install Recommended Extensions" banner'indan da
     kurulabilir). `.vscode/settings.json` zaten format-on-save + Biome'u
     default formatter yapar — ekstra ayar gerekmez.
   - **Zed**: ekstra eklenti kurmana gerek yok, `.zed/settings.json` Biome
     language server'ini otomatik indirip baglar.
   - **Cursor/Windsurf/diger VS Code fork'lari**: ayni `biomejs.biome`
     eklentisini Open VSX/marketplace'ten kur.
2. `pnpm install` calistir — bu ayni zamanda husky git hook'larini kurar
   (`prepare` script), ekstra adim gerekmez.
3. `.env.example`'i `.env` olarak kopyala, degerleri doldur (bkz. [Kurulum](#kurulum)).
4. Postgres'i ayaga kaldirip migration uygula (bkz. [Kurulum](#kurulum)).
5. `pnpm dev:all` ile client+server'i calistir, http://localhost:5173 acilir mi kontrol et.
6. Kod yazmadan once `CLAUDE.md` / `AGENTS.md`'yi ve `.claude/skills/`
   altindaki referans dosyalarini goz gecir — bu repoda hangi kutuphane
   nasil kullaniliyor, orada yazili (bkz. [AI agent kurallari ve skill'ler](#ai-agent-kurallari-ve-skiller)).

## Gereksinimler

- Node 22+
- pnpm >=12.4.2 (`engines.pnpm` + `.npmrc`'de `engine-strict=true` ile zorunlu kilinir)
- Docker (deploy icin)

pnpm 12, ilk kez kurulan bir bagimliligin surumu 24 saatten daha yeni yayinlandiysa
kurulumu reddeder (`minimumReleaseAge`, supply-chain koruma) — `.npmrc`'de
1440 dakikaya (1 gun) ayarli. Native build script'i olan paketler
(`@biomejs/biome`, `esbuild`) `pnpm-workspace.yaml`'daki `allowBuilds` altinda
onayli; yeni bir paket ayni sekilde postinstall calistirmak isterse pnpm
kurulumda uyarir, `pnpm-workspace.yaml`'a ekleyip onaylaman gerekir.

## Kurulum

```bash
pnpm install
cp .env.example .env
```

Lokal Postgres calistir (veya `docker compose up db -d`), sonra migration'lari uygula:

```bash
pnpm db:generate
pnpm db:migrate
```

## Gelistirme

```bash
pnpm dev:all
```

- Client: http://localhost:5173
- Server: http://localhost:3000
- API docs (Scalar): http://localhost:3000/reference

`dev:all` = `pnpm -r --parallel run dev`: client (`vite`) ve server
(`tsx watch`) ayni script adiyla (`dev`) tanimli oldugu icin pnpm ikisini de
prefixli output ile paralel calistirir — ekstra process-runner bagimliligi
yok. API dokumantasyonu server'in icinde `/reference` route'unda otomatik
hazir olur, ayri bir process gerekmez.

## Lint & Format

```bash
pnpm check      # biome check --write
pnpm lint
pnpm format
pnpm typecheck  # her app kendi typecheck script'ini calistirir (tsc --noEmit / astro check), pnpm -r --parallel ile
```

## Biome kurallari

Tek `biome.json`, tum workspace'i kapsar. Onemli noktalar:

- **Format**: cift tirnak, semicolon her zaman, trailing comma, 2 space indent, 100 karakter satir siniri.
- **Linter**: `recommended` set + `correctness.noUnusedVariables: warn`,
  `style.useImportType: error` (tip-only import'lar `import type` ile
  yazilmali — bundle'a sizmasin), `suspicious.noConsole: warn` (unutulmus
  `console.log`/`console.debug` yakalanir, `console.error/warn/info` bilincli
  log seviyesi oldugu icin serbest).
- **organizeImports**: acik, import sirasi otomatik duzenlenir.
- **ignore**: `dist`, `build`, `node_modules`, uretilen `routeTree.gen.ts`,
  `public`, `apps/server/drizzle` (migration ciktisi), `**/*.astro` (Biome
  `.astro` template syntax'ini anlamiyor — frontmatter'daki degiskenleri
  template'te kullanilmamis sanip yanlis "unused variable" hatasi verir;
  `.astro` dosyalari `astro check`/editor'un Astro eklentisi kapsar) —
  bunlari elle formatlamaya calisma, biome zaten dokunmuyor.

Bir kurali gerekcesiyle susturmak icin:

```ts
// biome-ignore lint/<kural>: neden gerekli oldugu
```

## Git hook'lari (husky)

`pnpm install` sonrasi otomatik kurulur (`prepare` script).

- **pre-commit**: `main`'e direkt commit engellenir (feature branch + PR
  zorunlu); staged dosyalarda `lint-staged` calisir (biome check --write).
- **commit-msg**: `commitlint` ile [Conventional Commits](https://www.conventionalcommits.org/)
  zorunlu (`feat: ...`, `fix: ...`, `chore: ...` vb — kural seti `commitlint.config.js`).
- **pre-push**: `main`'e direkt push da engellenir (uzak ref kontrolu, hangi
  local branch'ten push edildigine bakmaz); ardindan `typecheck` + `lint` +
  `build` (client ve server) calisir — agir kontroller push'a birakildi ki
  her commit yavaslamasin.

Ilk commit/push gibi istisnai durumlarda (repo daha yeni kurulduysa, `main`
disinda commit atacak bir gecmis yoksa) `main` engelini tek seferlik asmak
icin: `ALLOW_MAIN=1 git commit ...` / `ALLOW_MAIN=1 git push ...` — bu
`--no-verify`'den farkli olarak lint-staged/commitlint/typecheck/lint/build
kontrollerini atlamaz, sadece branch adi kontrolunu gecer.

`.editorconfig` biome'un kapsamadigi dosyalar icin (Dockerfile, YAML, md) temel
indent/line-ending tutarliligi saglar. `.github/PULL_REQUEST_TEMPLATE.md` her
PR'da ayni checklist'i (typecheck/lint/build/commit formati) getirir.

## Docker / Dokploy

Tek imaj hem client'in build edilmis static dosyalarini hem de server'i icerir;
production'da server ayni origin'den ikisini de serve eder.

```bash
docker compose up --build
```

Dokploy'da bu repo'yu Docker Compose servisi olarak baglaman yeterli;
`.env` degiskenlerini (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `CLIENT_URL`) panelden tanimla.

`GET /health` -> `{ status: "ok" }`, docker-compose'daki `app` servisinin
healthcheck'i bunu kullanir. Tum route'larda `hono/secure-headers`
middleware'i aktif (HSTS, X-Frame-Options, nosniff vb.).

## Yapi

```
apps/
  client/    # Vite + React + TanStack Router
  server/    # Hono + Drizzle + better-auth
  landing/   # Astro + React + Tailwind, static + blog (opsiyonel)
packages/
  shared/    # ortak zod schema'lari (client + server tarafindan import edilir)
```

## Opsiyonel modulleri kaldirma

`apps/landing` (ve ileride eklenecek `apps/mobile`) bagimsiz workspace
paketleridir; `client`/`server` onlara import ile baglanmaz. Istemiyorsan:

1. `apps/landing` klasorunu sil.
2. Kok `package.json`'daki o app'e ozel script satirlarini sil
   (`dev:landing`, `build:landing`). `dev:all` ve `typecheck` zaten
   `pnpm -r` ile calisiyor, silinen app'i otomatik atlar — elle dokunma.
3. `pnpm install` calistir (lockfile'daki kalinti girdiyi temizler).

Baska hicbir dosyada (Dockerfile, docker-compose, biome.json, CI) referans
yok — `apps/*` glob'u pnpm-workspace.yaml'da zaten silinen klasoru otomatik
dislar.

## AI agent kurallari ve skill'ler

- `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `.windsurf/rules/`, `.clinerules/`,
  `.github/copilot-instructions.md`, `.opencode/` — hangi AI coding araci
  kullanilirsa kullanilsin ayni iki kural otomatik aktif: **caveman**
  (kisa/teknik yanit tarzi) ve **ponytail** (YAGNI merdiveni, en az kod).
  Tek bir yerden (bu dosyalar) yonetiliyor, ekip arkadasi baska bir araca
  gecse de kurallar degismiyor.
- `.claude/skills/` — bu stack'e ozel referans skill'leri (Hono, better-auth,
  Drizzle, Zod v4, TanStack Router, TanStack Query, Zustand, Tailwind v4,
  shadcn/ui, Biome, pnpm workspaces). Her biri repodaki gercek kullanima gore
  yazilmis kisa bir cheatsheet + "yetmezse resmi `llms.txt`'i cek" talimati icerir.
