import { useEffect } from "react";

import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

import { AdminLayout } from "@/modules/admin";
import { useAccount, useAuth } from "@/modules/account";

export const Route = createFileRoute("/(admin)/admin")({
  ssr: false,
  component: AdminGuard,
});

// ponytail: component-level guard instead of beforeLoad — auth bootstrap is
// async, not available synchronously in beforeLoad without adding it to router context
function AdminGuard(): React.JSX.Element | null {
  const { isLoaded, isSignedIn } = useAuth();
  const { data: account, isLoading: accountLoading } = useAccount(isSignedIn);
  const navigate = useNavigate();
  // Wait for the account/role lookup too — right after sign-in, isSignedIn
  // flips true before the account query resolves, and we can't gate on role
  // until we actually have it.
  const ready = isLoaded && (!isSignedIn || !accountLoading);

  useEffect(() => {
    if (!ready) return;
    if (!isSignedIn) {
      void navigate({ to: "/sign-in" });
      return;
    }
    if (account?.role !== "admin") {
      void navigate({ to: "/" });
      return;
    }
  }, [ready, isSignedIn, account, navigate]);

  if (!ready || !isSignedIn || account?.role !== "admin") return null;

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
