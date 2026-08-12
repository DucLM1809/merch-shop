import { createLazyFileRoute } from "@tanstack/react-router";

import { AuthPageView, VerifyEmailView } from "@/modules/account";

export const Route = createLazyFileRoute("/(auth)/verify-email")({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token } = Route.useSearch();

  return (
    <AuthPageView>
      <VerifyEmailView token={token} />
    </AuthPageView>
  );
}
