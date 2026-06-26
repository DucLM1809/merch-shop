import { useEffect } from "react";

import { useAuth, useUser } from "@clerk/react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

import { AdminLayout } from "@/modules/admin";

export const Route = createFileRoute("/(admin)/admin")({
  component: AdminGuard,
});

// ponytail: component-level guard instead of beforeLoad — Clerk auth is async,
// not available synchronously in beforeLoad without adding it to router context
function AdminGuard(): React.JSX.Element | null {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      void navigate({ to: "/sign-in" });
      return;
    }
    if (user?.publicMetadata?.role !== "admin") {
      void navigate({ to: "/" });
      return;
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  if (!isLoaded || !isSignedIn || user?.publicMetadata?.role !== "admin") return null;

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
