import { EmptyState as ChakraEmptyState, VStack } from "@chakra-ui/react";
import type { JSX, ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
};

export function EmptyState({ title, description, icon, children }: EmptyStateProps): JSX.Element {
  return (
    <ChakraEmptyState.Root>
      <ChakraEmptyState.Content>
        {icon && <ChakraEmptyState.Indicator color="fg.subtle">{icon}</ChakraEmptyState.Indicator>}
        {description ? (
          <VStack textAlign="center" gap={1}>
            <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
            <ChakraEmptyState.Description>{description}</ChakraEmptyState.Description>
          </VStack>
        ) : (
          <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
        )}
        {children}
      </ChakraEmptyState.Content>
    </ChakraEmptyState.Root>
  );
}
