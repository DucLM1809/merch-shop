import type { JSX } from "react";
import { Box, Button, Text } from "@chakra-ui/react";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function QueryError({ message = "Something went wrong.", onRetry }: Props): JSX.Element {
  return (
    <Box p={8}>
      <Text color="red.400" mb={onRetry ? 3 : 0}>
        {message}
      </Text>
      {onRetry && (
        <Button size="sm" variant="outline" colorPalette="red" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Box>
  );
}
