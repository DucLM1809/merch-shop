import type { JSX } from 'react'

import { Box, Flex } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'

import { GamePageView } from './GamePageView'

import { ProductCatalog } from './ProductCatalog'
import { PublisherNav } from './PublisherNav'
import { usePublisher } from '../hooks'

type Props = {
  publisherSlug: string
  gameSlug: string
}

export function GamePage({ publisherSlug, gameSlug }: Props): JSX.Element {
  const { data: publisher, isLoading } = usePublisher(publisherSlug)

  const game = publisher?.games.find((g) => g.slug === gameSlug)

  return (
    <Flex>
      <PublisherNav activePublisherSlug={publisherSlug} activeGameSlug={gameSlug} />
      <Box
        flex={1}
        style={{ '--accent': publisher?.accentColor } as React.CSSProperties}
      >
        <GamePageView
          gameName={game?.name ?? gameSlug}
          publisherName={publisher?.name}
          accentColor={publisher?.accentColor}
          isLoading={isLoading}
        />
        <ProductCatalog
          filters={{ gameSlug }}
          renderLink={(p, children) => (
            <Link
              to="/$publisherSlug/$gameSlug/products/$productSlug"
              params={{ publisherSlug, gameSlug, productSlug: p.slug }}
            >
              {children}
            </Link>
          )}
        />
      </Box>
    </Flex>
  )
}
