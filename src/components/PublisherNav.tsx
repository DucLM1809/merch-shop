import { useQuery } from '@tanstack/react-query'
import { Box, Skeleton, VStack, chakra } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { client } from '../api/client'

const NavLink = chakra(Link)

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
        {publishers?.map((publisher) => {
          const isActivePublisher = activePublisherSlug === publisher.slug
          return (
            <Box key={publisher.id}>
              <NavLink
                to="/$publisherSlug"
                params={{ publisherSlug: publisher.slug }}
                display="block"
                px={3}
                py={2}
                borderRadius="md"
                fontWeight="semibold"
                textDecoration="none"
                color={isActivePublisher ? 'white' : 'gray.400'}
                bg={isActivePublisher ? 'gray.700' : 'transparent'}
                _hover={{ color: 'white', bg: 'gray.800' }}
                aria-current={isActivePublisher ? 'page' : undefined}
              >
                {publisher.name}
              </NavLink>
              <VStack gap={0} align="stretch" pl={3}>
                {publisher.games.map((game) => {
                  const isActiveGame = isActivePublisher && activeGameSlug === game.slug
                  return (
                    <NavLink
                      key={game.id}
                      to="/$publisherSlug/$gameSlug"
                      params={{ publisherSlug: publisher.slug, gameSlug: game.slug }}
                      display="block"
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontSize="sm"
                      textDecoration="none"
                      color={isActiveGame ? 'white' : 'gray.500'}
                      bg={isActiveGame ? 'gray.700' : 'transparent'}
                      _hover={{ color: 'gray.200', bg: 'gray.800' }}
                      aria-current={isActiveGame ? 'page' : undefined}
                    >
                      {game.name}
                    </NavLink>
                  )
                })}
              </VStack>
            </Box>
          )
        })}
      </VStack>
    </Box>
  )
}
