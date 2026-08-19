import { useEffect } from "react";

import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { useLocale } from "@/i18n/useLocale";
import { AuthPageView, SignInForm, useAccount, useAuth } from "@/modules/account";

export const Route = createLazyFileRoute("/$locale/(auth)/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const { isSignedIn } = useAuth();
  const { data: account, isLoading: accountLoading } = useAccount(isSignedIn);
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const locale = useLocale();
  // Wait for the role lookup so admins land on /admin instead of / — right
  // after sign-in, isSignedIn flips true before the account query resolves.
  const ready = isSignedIn && !accountLoading;

  useEffect(() => {
    if (!ready) return;
    if (redirect !== undefined) {
      navigate({ to: redirect });
      return;
    }
    navigate(
      account?.role === "admin"
        ? { to: "/$locale/admin", params: { locale } }
        : { to: "/$locale", params: { locale } }
    );
  }, [ready, account, redirect, locale, navigate]);

  if (isSignedIn) return null;

  return (
    <AuthPageView>
      <SignInForm />
    </AuthPageView>
  );
}
