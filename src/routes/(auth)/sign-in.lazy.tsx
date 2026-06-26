import { useEffect } from "react";

import { SignIn, useAuth } from "@clerk/react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthPageView } from "@/modules/account";

export const Route = createLazyFileRoute("/(auth)/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) navigate({ to: "/" });
  }, [isSignedIn, navigate]);

  if (isSignedIn) return null;

  return (
    <AuthPageView>
      <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/" />
    </AuthPageView>
  );
}
