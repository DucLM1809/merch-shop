import { Box, Flex, Heading, HStack, Skeleton, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { Publisher } from "@/api/types";
import { QueryError } from "@/components/QueryError";

export interface PublisherPageViewProps {
  publisher: Publisher | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

export function PublisherPageView({
  publisher,
  isLoading,
  isError,
  onRetry,
}: PublisherPageViewProps) {
  const { t } = useTranslation("catalog");

  if (isError) return <QueryError message={t("errors.publisher")} onRetry={onRetry} />;

  const accent = publisher?.accentColor;

  return (
    <Box
      px={8}
      pt={7}
      pb={6}
      borderBottom="1px solid"
      borderColor="border"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="3px"
        style={{
          background: accent ? `linear-gradient(90deg, ${accent}, transparent 60%)` : "transparent",
        }}
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
        pointerEvents="none"
        style={{
          background: accent
            ? `radial-gradient(ellipse 40% 80% at 0% 0%, ${accent}12, transparent)`
            : "transparent",
        }}
      />
      {isLoading ? (
        <HStack gap={4} position="relative">
          <Skeleton w={12} h={12} borderRadius="md" />
          <Skeleton h="8" w="52" borderRadius="md" />
        </HStack>
      ) : (
        <HStack gap={4} position="relative">
          <Flex
            w={12}
            h={12}
            borderRadius="md"
            align="center"
            justify="center"
            fontWeight="800"
            fontSize="xl"
            color="white"
            flexShrink={0}
            aria-hidden
            style={{
              background: accent ?? "#333",
              boxShadow: accent ? `0 0 24px ${accent}50` : "none",
            }}
          >
            {publisher?.name[0]}
          </Flex>
          <Box>
            <Heading
              size="xl"
              color="fg"
              lineHeight="tight"
              fontWeight="800"
              letterSpacing="-0.025em"
            >
              {publisher?.name}
            </Heading>
            <Text
              fontSize="xs"
              color="fg.subtle"
              mt={0.5}
              textTransform="uppercase"
              letterSpacing="0.08em"
              fontWeight="600"
            >
              {t("publisher.gameCount", { count: publisher?.games?.length ?? 0 })}
            </Text>
          </Box>
        </HStack>
      )}
    </Box>
  );
}
