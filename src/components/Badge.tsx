import { Box } from "@chakra-ui/react";
import type { JSX, ReactNode } from "react";

type BadgeTone = "neutral" | "accent" | "signal" | "success" | "danger" | "warning";

const TONE_PALETTE: Record<BadgeTone, string> = {
  neutral: "gray",
  accent: "blue",
  signal: "signal",
  success: "success",
  danger: "danger",
  warning: "warning",
};

type BadgeProps = {
  children: ReactNode;
  /** "count" is a small filled circle (e.g. the cart item count); "status" is an angled tag. */
  variant?: "count" | "status";
  tone?: BadgeTone;
};

const STATUS_CLIP_PATH = "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)";

export function Badge({ children, variant = "status", tone = "neutral" }: BadgeProps): JSX.Element {
  const colorPalette = TONE_PALETTE[tone];

  if (variant === "count") {
    return (
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        colorPalette={colorPalette}
        bg="colorPalette.solid"
        color="colorPalette.contrast"
        borderRadius="full"
        minW="18px"
        h="18px"
        px="3px"
        fontSize="10px"
        fontWeight="800"
        lineHeight="1"
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      colorPalette={colorPalette}
      bg="colorPalette.subtle"
      color="colorPalette.fg"
      borderWidth="1px"
      borderColor="colorPalette.muted"
      px="2.5"
      py="0.5"
      fontSize="xs"
      fontWeight="600"
      textTransform="uppercase"
      letterSpacing="wide"
      clipPath={STATUS_CLIP_PATH}
    >
      {children}
    </Box>
  );
}
