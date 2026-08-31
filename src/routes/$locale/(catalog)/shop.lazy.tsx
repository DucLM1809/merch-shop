import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/i18n/useLocale";
import { FacetFilter, ProductCatalog } from "@/modules/catalog";

export const Route = createLazyFileRoute("/$locale/(catalog)/shop")({
  component: ShopPage,
});

function ShopPage() {
  const { t } = useTranslation("catalog");
  const { game, team, character } = Route.useSearch();
  const navigate = Route.useNavigate();
  const locale = useLocale();

  const handleFilterChange = (key: "game" | "team" | "character", value: string | undefined) => {
    navigate({ search: (prev) => ({ ...prev, [key]: value }), replace: true });
  };

  return (
    <Box minH="100dvh" display="flex" flexDirection="column">
      <Box
        px={8}
        pt={8}
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
          bottom={0}
          w="3px"
          bgGradient="to-b"
          gradientFrom={{ base: "blue.600", _dark: "#0094e0" }}
          gradientTo="transparent"
        />
        <Flex align="baseline" gap={3} pl={4}>
          <Heading size="2xl" color="fg" fontWeight="800" letterSpacing="-0.03em" lineHeight="1">
            {t("shop.title")}
          </Heading>
          <Text
            fontSize="xs"
            color="blue.400"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.1em"
            mt={1}
          >
            {t("shop.eyebrow")}
          </Text>
        </Flex>
        <Text color="fg.subtle" fontSize="sm" mt={2} pl={4}>
          {t("shop.subtitle")}
        </Text>
      </Box>
      <Box display="flex" flexDirection={{ base: "column", md: "row" }} flex="1">
        <FacetFilter search={{ game, team, character }} onFilterChange={handleFilterChange} />
        <Box flex="1" minW={0}>
          <ProductCatalog
            filters={{ game, team, character }}
            renderLink={(p, children) => (
              <Link
                to="/$locale/$publisherSlug/$gameSlug/products/$productSlug"
                params={{
                  locale,
                  publisherSlug: p.publisherSlug,
                  gameSlug: p.gameSlug,
                  productSlug: p.slug,
                }}
              >
                {children}
              </Link>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}
