import { authClient } from "./auth-client";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookie = await authClient.getCookie();
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${path}`, {
    ...init,
    credentials: "omit",
    headers: { ...init?.headers, Cookie: cookie },
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}
