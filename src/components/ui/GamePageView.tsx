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
      pt={7}
      pb={6}
      borderBottom="1px solid"
      borderColor="gray.800"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="3px"
        style={{
          background: accentColor
            ? `linear-gradient(90deg, ${accentColor}, transparent 60%)`
            : 'transparent',
        }}
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
        pointerEvents="none"
        style={{
          background: accentColor
            ? `radial-gradient(ellipse 40% 80% at 0% 0%, ${accentColor}12, transparent)`
            : 'transparent',
        }}
      />
      {isLoading ? (
        <Skeleton h="8" w="48" borderRadius="md" />
      ) : (
        <Box position="relative">
          <Heading
            size="xl"
            color="white"
            lineHeight="tight"
            fontWeight="800"
            letterSpacing="-0.025em"
          >
            {gameName}
          </Heading>
          {publisherName && (
            <Text
              fontSize="xs"
              color="gray.500"
              mt={0.5}
              textTransform="uppercase"
              letterSpacing="0.08em"
              fontWeight="600"
            >
              {publisherName}
            </Text>
          )}
        </Box>
      )}
    </Box>
  )
}
