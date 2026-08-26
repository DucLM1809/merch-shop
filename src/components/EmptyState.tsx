import { Box, EmptyState as ChakraEmptyState, VStack } from "@chakra-ui/react";
import type { JSX, ReactNode } from "react";

type EmptyStateSize = "sm" | "md" | "lg";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  size?: EmptyStateSize;
  children?: ReactNode;
};

const BADGE_SIZE: Record<EmptyStateSize, string> = {
  sm: "10",
  md: "12",
  lg: "14",
};

// Same diagonal top-right cut as `Card`/`Badge`, scaled down for a badge-sized plate,
// so the icon marker reads as part of the storefront's angled-panel identity rather
// than a generic circular icon container.
const BADGE_CLIP_PATH = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)";

const REDUCED_MOTION_OVERRIDE = {
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
};

export function EmptyState({
  title,
  description,
  icon,
  size = "md",
  children,
}: EmptyStateProps): JSX.Element {
  return (
    <ChakraEmptyState.Root size={size}>
      <ChakraEmptyState.Content
        animationStyle="scale-fade-in"
        animationDuration="slower"
        animationTimingFunction="ease-out"
        css={REDUCED_MOTION_OVERRIDE}
      >
        {icon && (
          <ChakraEmptyState.Indicator>
            <Box
              boxSize={BADGE_SIZE[size]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              clipPath={BADGE_CLIP_PATH}
              colorPalette="signal"
              bg="colorPalette.subtle"
              color="colorPalette.fg"
              borderWidth="1px"
              borderColor="colorPalette.muted"
            >
              {icon}
            </Box>
          </ChakraEmptyState.Indicator>
        )}
        {description ? (
          <VStack textAlign="center" gap={1} maxW="sm">
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
