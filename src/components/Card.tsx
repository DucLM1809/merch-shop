import { Box, type BoxProps } from "@chakra-ui/react";
import type { JSX } from "react";

type CardProps = BoxProps & {
  /** Hover elevation + border lift, for cards that act as a click target. */
  interactive?: boolean;
  /** The clipped-corner signature. Off for tightly-packed rows (e.g. a table cell). */
  clipCorner?: boolean;
};

const CLIP_PATH = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)";

export function Card({ interactive = false, clipCorner = true, ...rest }: CardProps): JSX.Element {
  return (
    <Box
      position="relative"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.muted"
      borderRadius="lg"
      overflow="hidden"
      shadow="cardRest"
      clipPath={clipCorner ? CLIP_PATH : undefined}
      transition="transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease"
      _hover={
        interactive
          ? { transform: "translateY(-3px)", shadow: "cardHover", borderColor: "border.emphasized" }
          : undefined
      }
      {...rest}
    />
  );
}
