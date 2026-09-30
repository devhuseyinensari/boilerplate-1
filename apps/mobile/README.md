# apps/mobile

Expo (SDK 57) + Expo Router + better-auth. `client`/`server`'dan bagimsiz
workspace paketi — silmek icin kok `README.md`'deki
[Opsiyonel modulleri kaldirma](../../README.md#opsiyonel-modulleri-kaldirma)
bolumune bak.

## Yapi

```
src/
  app/
    _layout.tsx    # root Stack, SafeAreaProvider
    index.tsx      # herkese acik ana sayfa
    login.tsx       # server/auth.ts'deki ayni email+sifre akisi
    register.tsx
    dashboard.tsx   # korumali, session yoksa /login'e yonlendirir
  lib/
    auth-client.ts  # better-auth expo client (SecureStore ile token saklar)
    api-client.ts   # authClient.getCookie() ile authenticated fetch helper
```

`packages/shared`'daki `loginSchema`/`registerSchema` (zod) web client ile
birebir ayni, form validasyonu iki tarafta da tutarli.

## Kurulum

```bash
cp .env.example .env   # EXPO_PUBLIC_API_URL'i doldur
pnpm dev:mobile         # kok dizinden, localhost:8081 Metro bundler
```

Fiziksel cihazda (Expo Go/dev build) test ederken `localhost` calismaz —
`.env`'de makinenin LAN IP'sini kullan (`http://192.168.x.x:3000`).
Simulator/emulator icin `localhost` yeterli.

## better-auth + Expo

Server tarafinda (`apps/server/src/auth.ts`) `expo()` plugin'i ve
`trustedOrigins`'e `mobile://` scheme'i eklendi — ayni Postgres/better-auth
oturum sistemini web client ile mobile paylasir. Detay:
https://www.better-auth.com/docs/integrations/expo

## Notlar

- Expo'nun varsayilan template'indeki demo ekranlar (tabs, animasyonlu
  logo, glass-effect) silindi — bu boilerplate'in amaci "calisir durumda
  auth iskeleti", gosteri UI'i degil. `@expo/ui`, `expo-glass-effect`,
  `expo-symbols`, `expo-image`, `react-native-reanimated`,
  `react-native-worklets`, `react-native-gesture-handler` bagimliliklari da
  bu yuzden kaldirildi — ihtiyac olursa `npx expo install <paket>` ile geri
  eklenebilir.
- `reset-project` script'i (demo'yu `example/`'a tasiyip bos template
  birakan Expo betigi) silindi, artik anlami yok — proje zaten ozel.
