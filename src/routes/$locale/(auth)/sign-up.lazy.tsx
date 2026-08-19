import { useEffect } from "react";

import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { useLocale } from "@/i18n/useLocale";
import { AuthPageView, SignUpForm, useAuth } from "@/modules/account";

export const Route = createLazyFileRoute("/$locale/(auth)/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const locale = useLocale();

  useEffect(() => {
    if (isSignedIn) navigate({ to: "/$locale", params: { locale } });
  }, [isSignedIn, locale, navigate]);

  if (isSignedIn) return null;

  return (
    <AuthPageView>
      <SignUpForm />
    </AuthPageView>
  );
}
