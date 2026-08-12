import { useEffect, useRef, type JSX } from "react";

import { Box, Button, Heading, Spinner, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

import { useVerifyEmail } from "../hooks";

type Props = {
  token: string;
};

export function VerifyEmailView({ token }: Props): JSX.Element {
  const verifyEmail = useVerifyEmail();
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
          Verification failed
        </Heading>
        <Text color="gray.400" data-testid="verify-email-error">
          This verification link is invalid or has expired.
        </Text>
      </Box>
    );
  }

  if (verifyEmail.isSuccess) {
    return (
      <Box w="full" maxW="360px" textAlign="center">
        <Heading size="lg" color="white" fontWeight="800" mb={3}>
          Email verified
        </Heading>
        <Text color="gray.400" mb={4} data-testid="verify-email-success">
          Your email has been verified.
        </Text>
        <Link to="/">
          <Button colorPalette="blue">Continue</Button>
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
