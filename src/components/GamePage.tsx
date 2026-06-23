import { useQuery } from '@tanstack/react-query'
import { Box, Flex } from '@chakra-ui/react'
import { client } from '../api/client'
import { ProductCatalog } from './ProductCatalog'
import { PublisherNav } from './PublisherNav'
import { GamePageView } from './ui/GamePageView'

interface Props {
  publisherSlug: string
  gameSlug: string
}

export function GamePage({ publisherSlug, gameSlug }: Props) {
  const { data: publisher, isLoading } = useQuery({
    queryKey: ['publisher', publisherSlug],
    queryFn: () => client.getPublisher(publisherSlug),
  })

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
          getProductHref={(p) => `/${publisherSlug}/${gameSlug}/products/${p.slug}`}
        />
      </Box>
    </Flex>
  )
}
