import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { authClient, signOut } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardPage,
});

type Me = { id: string; name: string; email: string };

function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await apiClient.get<Me>("/me")).data,
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-slate-600">Yukleniyor...</p>
        ) : (
          <p className="text-sm text-slate-600">
            Hosgeldin, <span className="font-medium">{data?.name}</span> ({data?.email})
          </p>
        )}
        <Button
          variant="outline"
          onClick={async () => {
            await signOut();
            navigate({ to: "/login" });
          }}
        >
          Cikis Yap
        </Button>
      </CardContent>
    </Card>
  );
}
