import { useEffect } from "react";

import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthPageView, SignInForm, useAccount, useAuth } from "@/modules/account";

export const Route = createLazyFileRoute("/(auth)/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const { isSignedIn } = useAuth();
  const { data: account, isLoading: accountLoading } = useAccount(isSignedIn);
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  // Wait for the role lookup so admins land on /admin instead of / — right
  // after sign-in, isSignedIn flips true before the account query resolves.
  const ready = isSignedIn && !accountLoading;

  useEffect(() => {
    if (!ready) return;
    navigate({ to: redirect ?? (account?.role === "admin" ? "/admin" : "/") });
  }, [ready, account, redirect, navigate]);

  if (isSignedIn) return null;

  return (
    <AuthPageView>
      <SignInForm />
    </AuthPageView>
  );
}
