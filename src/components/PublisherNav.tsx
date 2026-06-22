import { useQuery } from '@tanstack/react-query'
import { Box, Skeleton, Text, VStack } from '@chakra-ui/react'
import { client } from '../api/client'

interface Props {
  activePublisherSlug?: string
  activeGameSlug?: string
}

export function PublisherNav({ activePublisherSlug, activeGameSlug }: Props = {}) {
  const { data: publishers, isLoading } = useQuery({
    queryKey: ['publishers'],
    queryFn: () => client.getPublishers(),
  })

  if (isLoading) {
    return (
      <Box w="52" p={4}>
        <VStack gap={2} align="stretch">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} h="6" borderRadius="md" />
          ))}
        </VStack>
      </Box>
    )
  }

  return (
    <Box as="nav" w="52" p={4} borderRight="1px solid" borderColor="gray.700" minH="100vh">
      <VStack gap={1} align="stretch">
        {publishers?.map((publisher) => (
          <Box key={publisher.id}>
            <Text
              as="a"
              href={`/${publisher.slug}`}
              display="block"
              px={3}
              py={2}
              borderRadius="md"
              fontWeight="semibold"
              color={activePublisherSlug === publisher.slug ? 'white' : 'gray.400'}
              bg={activePublisherSlug === publisher.slug ? 'gray.700' : 'transparent'}
              _hover={{ color: 'white', bg: 'gray.800' }}
              aria-current={activePublisherSlug === publisher.slug ? 'page' : undefined}
            >
              {publisher.name}
            </Text>
            <VStack gap={0} align="stretch" pl={3}>
              {publisher.games.map((game) => {
                const isActiveGame =
                  activePublisherSlug === publisher.slug && activeGameSlug === game.slug
                return (
                  <Text
                    key={game.id}
                    as="a"
                    href={`/${publisher.slug}/${game.slug}`}
                    display="block"
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                    color={isActiveGame ? 'white' : 'gray.500'}
                    bg={isActiveGame ? 'gray.700' : 'transparent'}
                    _hover={{ color: 'gray.200', bg: 'gray.800' }}
                    aria-current={isActiveGame ? 'page' : undefined}
                  >
                    {game.name}
                  </Text>
                )
              })}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}
