import { Box, Text, chakra } from "@chakra-ui/react";

const Label = chakra("label");

import type { JSX, ReactNode } from "react";
import type { FieldError } from "react-hook-form";

type Props = {
  name: string;
  label?: string;
  error?: FieldError | string;
  children: ReactNode;
  flex?: string;
};

export function FormField({ name, label, error, children, flex }: Props): JSX.Element {
  const message = typeof error === "string" ? error : error?.message;
  return (
    <Box flex={flex}>
      {label && (
        <Label htmlFor={name} fontSize="sm" color="gray.400" display="block" mb={1}>
          {label}
        </Label>
      )}
      {children}
      {message && (
        <Text color="red.400" fontSize="xs" mt={1}>
          {message}
        </Text>
      )}
    </Box>
  );
}
