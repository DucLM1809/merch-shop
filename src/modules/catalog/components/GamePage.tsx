import type { JSX } from "react";

import { Box, Flex } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

import { GamePageView } from "./GamePageView";

import { ProductCatalog } from "./ProductCatalog";
import { PublisherNav } from "./PublisherNav";
import { usePublisher } from "../hooks";
import { useLocale } from "@/i18n/useLocale";

type Props = {
  publisherSlug: string;
  gameSlug: string;
};

export function GamePage({ publisherSlug, gameSlug }: Props): JSX.Element {
  const { data: publisher, isLoading, isError, refetch } = usePublisher(publisherSlug);
  const locale = useLocale();

  const game = publisher?.games.find((g) => g.slug === gameSlug);

  return (
    <Flex>
      <PublisherNav activePublisherSlug={publisherSlug} activeGameSlug={gameSlug} />
      <Box flex={1} style={{ "--accent": publisher?.accentColor } as React.CSSProperties}>
        <GamePageView
          gameName={game?.name ?? gameSlug}
          publisherName={publisher?.name}
          accentColor={publisher?.accentColor}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <ProductCatalog
          filters={{ gameSlug }}
          renderLink={(p, children) => (
            <Link
              to="/$locale/$publisherSlug/$gameSlug/products/$productSlug"
              params={{ locale, publisherSlug, gameSlug, productSlug: p.slug }}
            >
              {children}
            </Link>
          )}
        />
      </Box>
    </Flex>
  );
}
