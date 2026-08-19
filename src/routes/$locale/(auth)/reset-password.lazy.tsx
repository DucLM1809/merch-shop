import { createLazyFileRoute } from "@tanstack/react-router";

import { AuthPageView, ResetPasswordForm } from "@/modules/account";

export const Route = createLazyFileRoute("/$locale/(auth)/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();

  return (
    <AuthPageView>
      <ResetPasswordForm token={token} />
    </AuthPageView>
  );
}
