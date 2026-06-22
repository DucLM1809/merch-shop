import { useQuery } from '@tanstack/react-query'
import { Box, Flex, Heading, Skeleton } from '@chakra-ui/react'
import { client } from '../api/client'
import { ProductCatalog } from './ProductCatalog'
import { PublisherNav } from './PublisherNav'

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
      <Box flex={1}>
        <Box
          p={8}
          pb={4}
          style={{ '--accent': publisher?.accentColor } as React.CSSProperties}
          borderBottom="1px solid"
          borderColor="gray.700"
        >
          {isLoading ? (
            <Skeleton h="8" w="48" borderRadius="md" />
          ) : (
            <Heading color="white">{publisher?.name}</Heading>
          )}
        </Box>
        <ProductCatalog filters={{ publisher: publisherSlug }} />
      </Box>
    </Flex>
  )
}
