import { useEffect, useState } from "react";

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

  // The server always renders signed-out (bootstrapAuth is client-only), so the first
  // client paint must match that regardless of how fast the real session resolves —
  // this route sits behind the lazy-loaded Outlet's Suspense boundary, so a same-tick
  // auth resolution can otherwise land between that boundary's hydration and its own,
  // and React discards the mismatched tree. See AuthPageView's hydration mismatch.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

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

  if (hasMounted && isSignedIn) return null;

  return (
    <AuthPageView>
      <SignInForm />
    </AuthPageView>
  );
}
