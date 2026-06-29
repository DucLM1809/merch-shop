import { Box, Text } from "@chakra-ui/react";

import type { JSX, ReactNode } from "react";
import type { FieldError } from "react-hook-form";

type Props = {
  label?: string;
  error?: FieldError | string;
  children: ReactNode;
  flex?: string;
};

export function FormField({ error, children, flex }: Props): JSX.Element {
  const message = typeof error === "string" ? error : error?.message;
  return (
    <Box flex={flex}>
      {children}
      {message && (
        <Text color="red.400" fontSize="xs" mt={1}>
          {message}
        </Text>
      )}
    </Box>
  );
}
