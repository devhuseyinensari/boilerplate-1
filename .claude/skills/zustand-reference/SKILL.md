---
name: zustand-reference
description: Reference for Zustand client-side state in apps/client. Use when adding global UI state (not server data — that's React Query, not auth session — that's better-auth's useSession).
---

# Zustand reference

`zustand` ^5 is installed in `apps/client` but **no store exists yet** — this
repo has no client-only state that needs one. Server data goes through React
Query (`tanstack-query-reference` skill), auth session through better-auth's
`useSession` (`better-auth-reference` skill). Only reach for Zustand for
state that is neither of those: UI toggles shared across distant components,
multi-step form wizard state, etc.

## Creating a store

```ts
// src/stores/example-store.ts
import { create } from "zustand";

type ExampleState = {
  isOpen: boolean;
  toggle: () => void;
};

export const useExampleStore = create<ExampleState>((set) => ({
  isOpen: false,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
```

Usage: `const isOpen = useExampleStore((s) => s.isOpen);` — always select the
slice you need, don't destructure the whole store in the component (causes
re-renders on every field change).

## Common middleware

- `persist` (`zustand/middleware`) — sync a store to `localStorage`.
- `devtools` (`zustand/middleware`) — Redux DevTools integration.
- `immer` (`zustand/middleware/immer`) — mutate-looking updates for nested state.

## When this isn't enough

Fetch `https://zustand.docs.pmnd.rs/llms.txt` for the doc index, then the
specific page.
