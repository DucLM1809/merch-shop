import { useEffect, useState } from "react";

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

  // The server always renders signed-out (bootstrapAuth is client-only), so the first
  // client paint must match that regardless of how fast the real session resolves —
  // this route sits behind the lazy-loaded Outlet's Suspense boundary, so a same-tick
  // auth resolution can otherwise land between that boundary's hydration and its own,
  // and React discards the mismatched tree. See AuthPageView's hydration mismatch.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (isSignedIn) navigate({ to: "/$locale", params: { locale } });
  }, [isSignedIn, locale, navigate]);

  if (hasMounted && isSignedIn) return null;

  return (
    <AuthPageView>
      <SignUpForm />
    </AuthPageView>
  );
}
