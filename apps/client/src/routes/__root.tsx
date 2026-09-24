import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex gap-4 border-b border-slate-200 bg-white px-6 py-3">
        <Link to="/" className="text-sm font-medium">
          Ana Sayfa
        </Link>
        <Link to="/login" className="text-sm font-medium">
          Giris
        </Link>
        <Link to="/register" className="text-sm font-medium">
          Kayit
        </Link>
        <Link to="/dashboard" className="text-sm font-medium">
          Dashboard
        </Link>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
