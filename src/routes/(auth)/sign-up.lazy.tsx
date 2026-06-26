import { useEffect } from "react";

import { SignUp, useAuth } from "@clerk/react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthPageView } from "@/modules/account";

export const Route = createLazyFileRoute("/(auth)/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) navigate({ to: "/" });
  }, [isSignedIn, navigate]);

  if (isSignedIn) return null;

  return (
    <AuthPageView>
      <SignUp routing="path" path="/sign-up" fallbackRedirectUrl="/" />
    </AuthPageView>
  );
}
