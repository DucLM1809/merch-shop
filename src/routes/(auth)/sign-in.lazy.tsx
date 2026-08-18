import { useEffect } from "react";

import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthPageView, SignInForm, useAuth } from "@/modules/account";

export const Route = createLazyFileRoute("/(auth)/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const { isSignedIn } = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) navigate({ to: redirect ?? "/" });
  }, [isSignedIn, redirect, navigate]);

  if (isSignedIn) return null;

  return (
    <AuthPageView>
      <SignInForm />
    </AuthPageView>
  );
}
