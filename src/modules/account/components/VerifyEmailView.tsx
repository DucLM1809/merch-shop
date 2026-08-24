import { useEffect, useRef, type JSX } from "react";

import { Box, Button, Heading, Spinner, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/i18n/useLocale";

import { useVerifyEmail } from "../hooks";

type Props = {
  token: string;
};

export function VerifyEmailView({ token }: Props): JSX.Element {
  const { t } = useTranslation("account");
  const verifyEmail = useVerifyEmail();
  const locale = useLocale();
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current || !token) return;
    requested.current = true;
    verifyEmail.mutate({ token });
  }, [token, verifyEmail]);

  if (!token || verifyEmail.isError) {
    return (
      <Box w="full" maxW="360px" textAlign="center">
        <Heading size="lg" color="white" fontWeight="800" mb={3}>
          {t("verifyEmail.failedTitle")}
        </Heading>
        <Text color="gray.400" data-testid="verify-email-error">
          {t("verifyEmail.failedBody")}
        </Text>
      </Box>
    );
  }

  if (verifyEmail.isSuccess) {
    return (
      <Box w="full" maxW="360px" textAlign="center">
        <Heading size="lg" color="white" fontWeight="800" mb={3}>
          {t("verifyEmail.successTitle")}
        </Heading>
        <Text color="gray.400" mb={4} data-testid="verify-email-success">
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
