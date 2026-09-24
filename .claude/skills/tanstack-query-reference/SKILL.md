---
name: tanstack-query-reference
description: Reference for TanStack Query (React Query) data fetching in apps/client. Use when adding useQuery/useMutation calls or touching the QueryClient setup in main.tsx.
---

# TanStack Query reference

Single `QueryClient` created in `apps/client/src/main.tsx`, provided via
`QueryClientProvider`. Server calls go through the shared `apiClient` axios
instance (`apps/client/src/lib/api-client.ts`, baseURL `/api`, cookies
included) — see `dashboard.tsx` for the pattern:

```ts
const { data, isLoading } = useQuery({
  queryKey: ["me"],
  queryFn: async () => (await apiClient.get<Me>("/me")).data,
});
```

## Mutations

```ts
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (input: X) => apiClient.post("/thing", input),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["thing"] }),
});
```

## Conventions to keep

- `queryKey` arrays should mirror the resource path (`["me"]`, `["posts", postId]`).
- Don't fetch in `useEffect` — always `useQuery`/`useMutation`.
- Auth errors (401 from `apiClient`) should redirect to `/login` via the
  router, not be swallowed silently.

## When this isn't enough

Fetch `https://tanstack.com/query/latest/llms.txt` for the doc index, then
the specific page (e.g. `.../docs/framework/react/guides/mutations.md`).
