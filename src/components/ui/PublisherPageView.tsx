import { Box, Heading, HStack, Skeleton, Text } from '@chakra-ui/react'
import type { Publisher } from '../../api/types'

export interface PublisherPageViewProps {
  publisher: Publisher | undefined
  isLoading: boolean
}

export function PublisherPageView({ publisher, isLoading }: PublisherPageViewProps) {
  return (
    <Box
      px={8}
      pt={6}
      pb={4}
      borderBottom="1px solid"
      borderColor="gray.700"
      position="relative"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="2px"
        style={{ background: publisher?.accentColor ?? 'transparent' }}
      />
      {isLoading ? (
        <HStack gap={3}>
          <Skeleton w={10} h={10} borderRadius="md" />
          <Skeleton h="7" w="48" borderRadius="md" />
        </HStack>
      ) : (
        <HStack gap={3}>
          <Box
            w={10}
            h={10}
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="700"
            fontSize="lg"
            color="white"
            flexShrink={0}
            style={{ background: publisher?.accentColor ?? '#444' }}
            aria-hidden
          >
            {publisher?.name[0]}
          </Box>
          <Box>
            <Heading size="lg" color="white" lineHeight="tight">
              {publisher?.name}
            </Heading>
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              {publisher?.games.length ?? 0}{' '}
              {publisher?.games.length === 1 ? 'game' : 'games'}
            </Text>
          </Box>
        </HStack>
      )}
    </Box>
  )
}
