import { createLazyFileRoute } from "@tanstack/react-router";

import { AuthPageView, ForgotPasswordForm } from "@/modules/account";

export const Route = createLazyFileRoute("/$locale/(auth)/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthPageView>
      <ForgotPasswordForm />
    </AuthPageView>
  );
}
