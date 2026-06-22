import { useQuery } from '@tanstack/react-query'
import { Box, Flex } from '@chakra-ui/react'
import { client } from '../api/client'
import { ProductCatalog } from './ProductCatalog'
import { PublisherNav } from './PublisherNav'
import { PublisherPageView } from './ui/PublisherPageView'

interface Props {
  publisherSlug: string
}

export function PublisherPage({ publisherSlug }: Props) {
  const { data: publisher, isLoading } = useQuery({
    queryKey: ['publisher', publisherSlug],
    queryFn: () => client.getPublisher(publisherSlug),
  })

  return (
    <Flex>
      <PublisherNav activePublisherSlug={publisherSlug} />
      <Box
        flex={1}
        style={{ '--accent': publisher?.accentColor } as React.CSSProperties}
      >
        <PublisherPageView publisher={publisher} isLoading={isLoading} />
        <ProductCatalog filters={{ publisher: publisherSlug }} />
      </Box>
    </Flex>
  )
}
