import { Box, Heading, Skeleton, Text } from '@chakra-ui/react'

export interface GamePageViewProps {
  gameName: string | undefined
  publisherName: string | undefined
  accentColor: string | undefined
  isLoading: boolean
}

export function GamePageView({ gameName, publisherName, accentColor, isLoading }: GamePageViewProps) {
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
        style={{ background: accentColor ?? 'transparent' }}
      />
      {isLoading ? (
        <Skeleton h="7" w="48" borderRadius="md" />
      ) : (
        <>
          <Heading size="lg" color="white" lineHeight="tight">
            {gameName}
          </Heading>
          {publisherName && (
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              {publisherName}
            </Text>
          )}
        </>
      )}
    </Box>
  )
}
