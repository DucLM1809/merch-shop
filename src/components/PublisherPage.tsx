import { useQuery } from '@tanstack/react-query'
import { Box, Flex, Heading, HStack, Skeleton } from '@chakra-ui/react'
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
          borderBottom="1px solid"
          borderColor="gray.700"
          style={{ '--accent': publisher?.accentColor } as React.CSSProperties}
        >
          {isLoading ? (
            <HStack gap={3}>
              <Skeleton w={10} h={10} borderRadius="full" />
              <Skeleton h="8" w="48" borderRadius="md" />
            </HStack>
          ) : (
            <HStack gap={3}>
              <Box
                w={10}
                h={10}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                fontSize="lg"
                color="white"
                flexShrink={0}
                style={{ background: publisher?.accentColor ?? '#666' }}
                aria-hidden
              >
                {publisher?.name[0]}
              </Box>
              <Heading color="white">{publisher?.name}</Heading>
            </HStack>
          )}
        </Box>
        <ProductCatalog filters={{ publisher: publisherSlug }} />
      </Box>
    </Flex>
  )
}
