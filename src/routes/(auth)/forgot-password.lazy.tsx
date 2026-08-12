import { createLazyFileRoute } from "@tanstack/react-router";

import { AuthPageView, ForgotPasswordForm } from "@/modules/account";

export const Route = createLazyFileRoute("/(auth)/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthPageView>
      <ForgotPasswordForm />
    </AuthPageView>
  );
}
