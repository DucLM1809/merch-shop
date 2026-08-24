import type { JSX } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function QueryError({ message, onRetry }: Props): JSX.Element {
  const { t } = useTranslation();

  return (
    <Box p={8}>
      <Text color="red.400" mb={onRetry ? 3 : 0}>
        {message ?? t("queryError.message")}
      </Text>
      {onRetry && (
        <Button size="sm" variant="outline" colorPalette="red" onClick={onRetry}>
          {t("queryError.retry")}
        </Button>
      )}
    </Box>
  );
}
