import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Fullstack Boilerplate</h1>
      <p className="mt-2 text-slate-600">
        Hono + Drizzle + better-auth + TanStack Router + React Query
      </p>
    </div>
  );
}
