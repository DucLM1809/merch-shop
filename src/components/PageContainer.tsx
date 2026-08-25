import { Box, type BoxProps } from "@chakra-ui/react";
import type { JSX } from "react";

const MAX_WIDTH = {
  sm: "3xl",
  md: "5xl",
  lg: "7xl",
} as const;

type PageContainerProps = BoxProps & {
  /** sm: forms/auth. md: product detail, account orders. lg: catalog, admin. */
  size?: keyof typeof MAX_WIDTH;
};

export function PageContainer({ size = "lg", ...rest }: PageContainerProps): JSX.Element {
  return <Box maxW={MAX_WIDTH[size]} mx="auto" px={{ base: 4, md: 8 }} {...rest} />;
}
