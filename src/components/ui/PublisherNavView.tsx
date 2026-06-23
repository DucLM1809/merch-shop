import { Box, HStack, Skeleton, VStack } from '@chakra-ui/react'
import type { Publisher } from '../../api/types'
import type { ReactNode } from 'react'

export interface PublisherNavViewProps {
  publishers: Publisher[] | undefined
  isLoading: boolean
  activePublisherSlug?: string
  activeGameSlug?: string
  renderLink: (
    to: string,
    params: Record<string, string>,
    children: ReactNode,
    ariaCurrent?: 'page' | undefined,
  ) => ReactNode
}

export function PublisherNavView({
  publishers,
  isLoading,
  activePublisherSlug,
  activeGameSlug,
  renderLink,
}: PublisherNavViewProps) {
  if (isLoading) {
    return (
      <Box w="56" p={4} borderRight="1px solid" borderColor="gray.700" minH="100dvh" flexShrink={0}>
        <VStack gap={3} align="stretch" pt={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} h="5" borderRadius="md" />
          ))}
        </VStack>
      </Box>
    )
  }

  return (
    <Box
      as="nav"
      w="56"
      py={5}
      px={3}
      borderRight="1px solid"
      borderColor="gray.700"
      minH="100dvh"
      flexShrink={0}
    >
      <VStack gap={1} align="stretch">
        {publishers?.map((publisher) => {
          const isActivePublisher = activePublisherSlug === publisher.slug
          const publisherLinkChildren = (
            <HStack gap={2.5} align="center">
              <Box
                w="1.75"
                h="1.75"
                borderRadius="full"
                flexShrink={0}
                transition="opacity 0.15s"
                style={{
                  background: publisher.accentColor,
                  opacity: isActivePublisher ? 1 : 0.45,
                }}
              />
              <Box
                fontSize="sm"
                fontWeight={isActivePublisher ? '600' : '500'}
              >
                {publisher.name}
              </Box>
            </HStack>
          )

          return (
            <Box key={publisher.id} mb={1}>
              {renderLink(
                '/$publisherSlug',
                { publisherSlug: publisher.slug },
                publisherLinkChildren,
                isActivePublisher ? 'page' : undefined,
              )}
              {publisher.games.length > 0 && (
                <VStack gap={0} align="stretch" pl={4} pt={0.5}>
                  {publisher.games.map((game) => {
                    const isActiveGame = isActivePublisher && activeGameSlug === game.slug
                    return (
                      <Box key={game.id}>
                        {renderLink(
                          '/$publisherSlug/$gameSlug',
                          { publisherSlug: publisher.slug, gameSlug: game.slug },
                          game.name,
                          isActiveGame ? 'page' : undefined,
                        )}
                      </Box>
                    )
                  })}
                </VStack>
              )}
            </Box>
          )
        })}
      </VStack>
    </Box>
  )
}
