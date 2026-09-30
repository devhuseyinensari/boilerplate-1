# Fullstack Boilerplate

pnpm workspaces monorepo: web client, backend, landing/blog ve mobile app —
dordu de birbirinden bagimsiz workspace paketi, sadece calisma zamaninda HTTP
uzerinden konusurlar. Hangisini kullanacagini kendin secersin; ihtiyacin
olmayanlari nasil temiz sekilde silecegin [Opsiyonel modulleri
kaldirma](#opsiyonel-modulleri-kaldirma) bolumunde adim adim anlatiliyor.
Kalan app'ler (`client` + `server`) tek Docker imajinda birlikte calisir.

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

- **Monorepo**: pnpm workspaces (`apps/client`, `apps/server`, `apps/landing`, `apps/mobile`, `packages/shared`)
- **Lint/Format**: Biome
- **Client**: TanStack Router, React Query, Zustand, React Hook Form, Zod, Axios, Tailwind v4, shadcn-tarzi componentler
- **Server**: Hono, Drizzle ORM + PostgreSQL, better-auth (email/sifre), `@hono/zod-openapi` + Scalar (API docs)
- **Landing**: Astro (static output) + React islands + Tailwind v4, content collections ile blog — *opsiyonel, bkz. [Opsiyonel modulleri kaldirma](#opsiyonel-modulleri-kaldirma)*
- **Mobile**: Expo (SDK 57) + Expo Router + better-auth (`@better-auth/expo`, server ile ayni oturum) — *opsiyonel, bkz. [Opsiyonel modulleri kaldirma](#opsiyonel-modulleri-kaldirma)*

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
3. **Hangi app'leri kullanacagina karar ver** — hepsi (client + server +
   landing + mobile) gelir, ama hepsi zorunlu degil. Sadece landing mi
   yapacaksin? Mobil + backend, web client'siz mi? Bkz. [Opsiyonel
   modulleri kaldirma](#opsiyonel-modulleri-kaldirma) — istemedigini simdi
   sil, geri kalan adimlar sadece elinde kalan app'ler icin gecerli olur.
4. `.env.example`'i `.env` olarak kopyala, degerleri doldur (bkz. [Kurulum](#kurulum)) —
   `server` kullanmiyorsan bu adimi atla.
5. `server` kullaniyorsan Postgres'i ayaga kaldirip migration uygula (bkz. [Kurulum](#kurulum)).
6. `pnpm dev:all` ile elindeki app'leri calistir, ilgili localhost portlari
   acilir mi kontrol et (bkz. [Gelistirme](#gelistirme)).
7. Kod yazmadan once `CLAUDE.md` / `AGENTS.md`'yi ve `.claude/skills/`
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

Expo çok sık patch yayınlıyor; `apps/mobile`'de `expo install` ile eklenen
bazı paketler bu yüzden `pnpm-workspace.yaml`'daki `minimumReleaseAgeExclude`
listesinde (surum sabitlenerek) onaylı. Ileride yeni bir Expo paketi/surumu
ayni "too new" hatasini verirse, aynı listeye `paket@surum` seklinde ekleyip
tekrar `pnpm install` calistirman yeterli — güvenlik amacli, kalici bozukluk
degil.

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
pnpm dev:all           # elindeki tum app'leri paralel baslatir
# veya tek tek:
pnpm dev:client
pnpm dev:server
pnpm dev:landing
pnpm dev:mobile
```

- Client: http://localhost:5173
- Server: http://localhost:3000
- API docs (Scalar): http://localhost:3000/reference
- Landing: http://localhost:4321
- Mobile: Metro bundler (Expo Go / simulator / `--web` ile tarayici) — detay `apps/mobile/README.md`

`dev:all` = `pnpm -r --parallel run dev`: her app kendi `package.json`'unda
ayni script adini (`dev`) tanimladigi icin pnpm hepsini prefixli output ile
paralel calistirir — ekstra process-runner bagimliligi yok. Bir app'i
sildiysen `dev:all` otomatik atlar, elle dokunmana gerek yok. API
dokumantasyonu server'in icinde `/reference` route'unda otomatik hazir olur,
ayri bir process gerekmez.

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
  local branch'ten push edildigine bakmaz); ardindan `typecheck` (tum
  workspace) + `lint` + `build` (client ve server, deploy edilen imaj) +
  `build:landing` calisir — agir kontroller push'a birakildi ki her commit
  yavaslamasin. `apps/mobile`'in yerel "build" adimi yok (EAS/cloud'da
  yapilir), typecheck+lint zaten kapsiyor.

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
  mobile/    # Expo + Expo Router + better-auth (opsiyonel)
packages/
  shared/    # ortak zod schema'lari (client + server + mobile tarafindan import edilir)
```

## Opsiyonel modulleri kaldirma

4 app da birbirinden bagimsiz workspace paketidir — biri digerini import
etmez, sadece calisma zamaninda HTTP ile konusurlar (client/mobile ->
server'a auth+API icin baglanir). Bagimlilik haritasi:

| App | Neye bagli | Onu bagli olan |
|---|---|---|
| `apps/landing` | hicbir seye | hicbiri — tamamen bagimsiz |
| `apps/client` | `apps/server` (auth, `/api/me`) | — |
| `apps/mobile` | `apps/server` (auth, `@better-auth/expo`) | — |
| `apps/server` | Postgres | `client`, `mobile` |
| `packages/shared` | — | `client`, `mobile` (zod form schema'lari) |

Bundan cikan pratik sonuc: **`landing` her zaman tek basina silinebilir/kalabilir.
`client` ve `mobile` birbirinden bagimsiz silinebilir. `server`'i silmek
`client`/`mobile`'in auth'unu calismaz hale getirir** — server'siz web/mobil
client tutmak istiyorsan auth'u kendi basina yeniden kurman gerekir, bu
mekanik bir silme degil.

### Tek tek app kaldirma

**`apps/landing`** — bagimsiz, en basit durum:
1. `apps/landing` klasorunu sil.
2. Kok `package.json`'dan `dev:landing` ve `build:landing` satirlarini sil.
3. `.husky/pre-push`'daki `&& pnpm build:landing` kismini sil.
4. `pnpm install`.

**`apps/mobile`** — server'a sadece auth uzerinden bagli:
1. `apps/mobile` klasorunu sil.
2. Kok `package.json`'dan `dev:mobile` satirini sil.
3. `apps/server/src/auth.ts`'deki `expo()` plugin'ini ve
   `trustedOrigins`'deki `mobile://`/`exp://` girdilerini kaldir.
4. `apps/client` de siliniyorsa `packages/shared` artik hic kullanilmiyor
   demektir (sadece login/register form schema'lari icindi, kodda sadece
   `client`/`mobile` import ediyordu) — istersen onu da sil.
   `apps/server/package.json`'da `@repo/shared` bagimliligi listelenir ama
   kodda hic import edilmez, o satiri da silebilirsin (zararsiz kalinti).
5. `pnpm install`.

**`apps/client`** — server bunun icin static-serve + CORS mantigi barindiriyor,
en fazla dosyaya dokunan silme bu:
1. `apps/client` klasorunu sil.
2. Kok `package.json`: `dev:client` satirini sil, `build` script'ini
   `"pnpm --filter server build"` yap (`&& pnpm --filter client build`
   kismini at).
3. `apps/server/src/index.ts`'de `NODE_ENV === "production"` blogundaki iki
   `serveStatic(...)` cagrisini ve `serveStatic` import'unu sil — artik
   serve edilecek bir client build'i yok.
4. `Dockerfile`'da: deps stage'deki `COPY apps/client/package.json ...`
   satirini, build stage'deki `RUN pnpm --filter client build` ve
   `COPY --from=build /app/apps/client/dist ./public` satirlarini sil.
5. `CLIENT_URL` env degiskeni (`apps/server/src/env.ts` + CORS/trustedOrigins)
   hala bir amaca hizmet ediyor mu kontrol et: `mobile` kaliyorsa kendi
   `mobile://` scheme'i zaten ayri, ama `env.CLIENT_URL` zorunlu alan
   (`z.string().url()`) — silmek istemiyorsan `landing`'in URL'ine ya da
   herhangi gecerli bir origin'e isaret ettir; tamamen kaldirmak istersen
   `env.ts` ve `auth.ts`'deki referanslari da temizle.
6. `pnpm install`.

**`apps/server`** — sadece server'i silmek `client`/`mobile`'in auth'unu
kirar; bu app'leri de tutacaksan once onlarin auth entegrasyonunu (better-auth
client + `/api/me` cagrilari) kendi coziimune gore yeniden yazman gerekir.
Sadece `landing` kalacaksa asagidaki senaryoya bak.

### Senaryolar

**"Sadece landing" (auth'suz, saf static site):** `apps/client`,
`apps/server`, `apps/mobile`, `packages/shared` sil. `Dockerfile`,
`docker-compose.yml`, kok `.env`/`.env.example` (`DATABASE_URL`,
`BETTER_AUTH_*`) artik gereksiz — landing zaten backend'siz static output
uretiyor, istersen bunlari da sil ya da basit bir static-host Dockerfile'a
(nginx/caddy) cevir. Kok `package.json`'da `dev:client`/`dev:server`/
`dev:mobile`/`build`/`db:*` script'lerini sil, sadece `dev:landing`/
`build:landing` kalsin.

**"Mobil + landing + backend, web client yok":** sadece `apps/client`'i sil
(yukaridaki adimlari uygula — server'in static-serve blogu, Dockerfile,
`CLIENT_URL`). `server`, `mobile`, `landing`, `packages/shared` (mobile hala
kullaniyor) oldugu gibi kalir.

**"Hepsi kalsin":** hicbir sey yapma, varsayilan durum bu.

Hangi kombinasyonu secersen sec, `apps/*` glob'u pnpm-workspace.yaml'da
zaten silinen klasoru otomatik dislar — workspace registry dosyasinda ekstra
duzenleme gerekmez.

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
