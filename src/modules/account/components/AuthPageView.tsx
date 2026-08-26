import type { JSX, ReactNode } from "react";

import { Box, Flex } from "@chakra-ui/react";

import { Card } from "@/components/Card";

type Props = {
  children: ReactNode;
};

// A faint access-panel grid, masked so it fades out toward the edges rather than
// hard-cropping — decorative texture only, not a semantic UI color, so a literal
// rgba value here follows the same convention as the rgba shadow tokens in theme.ts.
// The dot itself is tuned per mode (the same dark-canvas gray reads too faint against a
// white canvas), via a conditional style value rather than a second component variant.
const GRID_PATTERN = {
  base: "radial-gradient(circle, rgba(91, 97, 120, 0.35) 1px, transparent 1px)",
  _dark: "radial-gradient(circle, rgba(123, 130, 150, 0.5) 1px, transparent 1px)",
};
const GRID_MASK = "radial-gradient(ellipse 60% 55% at 50% 42%, black 0%, transparent 75%)";

export function AuthPageView({ children }: Props): JSX.Element {
  return (
    <Box position="relative" overflow="hidden" minH="80vh">
      <Box
        position="absolute"
        inset={0}
        bgImage={GRID_PATTERN}
        bgSize="28px 28px"
        opacity={0.5}
        maskImage={GRID_MASK}
        aria-hidden="true"
      />

      <Box
        position="absolute"
        top="8%"
        left="50%"
        w="640px"
        h="640px"
        borderRadius="full"
        bgGradient="radial"
        gradientFrom="blue.500/32"
        gradientTo="transparent"
        filter="blur(110px)"
        transform="translateX(-50%)"
        aria-hidden="true"
      />

      <Flex position="relative" justify="center" align="center" minH="80vh" px={4}>
        <Card
          w="full"
          maxW="480px"
          px={{ base: 6, md: 10 }}
          py={{ base: 8, md: 10 }}
          shadow="cardHover"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {children}
        </Card>
      </Flex>
    </Box>
  );
}
