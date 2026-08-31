import { useEffect, useRef, useState, type JSX } from "react";

import { Box, Button, Heading, Spinner, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/i18n/useLocale";

import { useVerifyEmail } from "../hooks";

type Props = {
  token: string;
};

type VerifyStatus = "pending" | "success" | "error";

export function VerifyEmailView({ token }: Props): JSX.Element {
  const { t } = useTranslation("account");
  const locale = useLocale();
  const requested = useRef(false);
  // Driven off useVerifyEmail's own onSuccess/onError (see merch-shop-bz7) rather
  // than the mutation's reactive isError/isSuccess snapshot, which isn't reliable
  // for a mutation fired from an effect on mount instead of a user event.
  const [status, setStatus] = useState<VerifyStatus>(token ? "pending" : "error");
  const handleVerifySuccess = (): void => setStatus("success");
  const handleVerifyError = (): void => setStatus("error");
  const verifyEmail = useVerifyEmail({
    onSuccess: handleVerifySuccess,
    onError: handleVerifyError,
  });

  useEffect(() => {
    if (requested.current || !token) return;
    requested.current = true;
    verifyEmail.mutate({ token });
  }, [token, verifyEmail]);

  if (status === "error") {
    return (
      <Box w="full" maxW="360px" textAlign="center">
        <Heading as="h1" textStyle="h1" color="fg" mb={3}>
          {t("verifyEmail.failedTitle")}
        </Heading>
        <Text color="fg.muted" data-testid="verify-email-error">
          {t("verifyEmail.failedBody")}
        </Text>
      </Box>
    );
  }

  if (status === "success") {
    return (
      <Box w="full" maxW="360px" textAlign="center">
        <Heading as="h1" textStyle="h1" color="fg" mb={3}>
          {t("verifyEmail.successTitle")}
        </Heading>
        <Text color="fg.muted" mb={4} data-testid="verify-email-success">
          {t("verifyEmail.successBody")}
        </Text>
        <Link to="/$locale" params={{ locale }}>
          <Button colorPalette="blue">{t("verifyEmail.continue")}</Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box w="full" maxW="360px" textAlign="center">
      <Spinner data-testid="verify-email-loading" />
    </Box>
  );
}
