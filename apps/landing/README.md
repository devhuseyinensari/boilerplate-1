# apps/landing

Astro (static output) + React islands + Tailwind v4. `client`/`server`'dan
bagimsiz workspace paketi — silmek icin kok `README.md`'deki
[Opsiyonel modulleri kaldirma](../../README.md#opsiyonel-modulleri-kaldirma)
bolumune bak.

## Yapi

```
src/
  content/blog/       # blog yazilari (.md), her dosya bir yazi
  content.config.ts   # blog collection schema'si (zod)
  layouts/Layout.astro
  pages/
    index.astro
    blog/index.astro       # yazi listesi
    blog/[slug].astro      # yazi detayi
  styles/global.css   # @import "tailwindcss" + typography plugin
```

Yeni blog yazisi eklemek icin `src/content/blog/` altina `.md` dosyasi
koymak yeterli, `content.config.ts`'deki zod schema'sina uymasi gerekir
(`title`, `description`, `pubDate`).

## Komutlar (kok dizinden)

```bash
pnpm dev:landing      # localhost:4321
pnpm build:landing    # ./dist static cikti
pnpm --filter landing typecheck   # astro check
```

## Notlar

- Biome `.astro` dosyalarini parse edemiyor (template syntax'i anlamiyor,
  yanlis "unused variable" hatasi verir) — bu yuzden `**/*.astro`
  `biome.json`'da ignore edilmis. Tip kontrolu `astro check` uzerinden.
- `output: "static"` — sunucu gerektirmez, herhangi bir CDN/static host'a
  `dist/` klasoru atilir. SSR gerekirse `astro.config.mjs`'de
  `output: "server"` + bir adapter (`@astrojs/node` vb.) eklenmeli.
