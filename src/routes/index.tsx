import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'

import { FacetFilter, ProductCatalog } from '@/modules/catalog'

const filterSearch = z.object({
  game: z.string().optional(),
  team: z.string().optional(),
  character: z.string().optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: filterSearch,
  component: HomePage,
})

function HomePage() {
  const { game, team, character } = Route.useSearch()

  return (
    <Box minH="100dvh" display="flex" flexDirection="column">
      <Box
        px={8}
        pt={8}
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
          bottom={0}
          w="3px"
          style={{ background: 'linear-gradient(to bottom, #0094e0, transparent)' }}
        />
        <Flex align="baseline" gap={3} pl={4}>
          <Heading
            size="2xl"
            color="white"
            fontWeight="800"
            letterSpacing="-0.03em"
            lineHeight="1"
          >
            All Products
          </Heading>
          <Text
            fontSize="xs"
            color="blue.400"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.1em"
            mt={1}
          >
            Official Merch
          </Text>
        </Flex>
        <Text color="gray.500" fontSize="sm" mt={2} pl={4}>
          Gear from your favorite games and teams
        </Text>
      </Box>
      <Box display="flex" flex="1">
        <FacetFilter />
        <Box flex="1" minW={0}>
          <ProductCatalog
            filters={{ game, team, character }}
            renderLink={(p, children) => (
              <Link
                to="/$publisherSlug/$gameSlug/products/$productSlug"
                params={{ publisherSlug: p.publisherSlug, gameSlug: p.gameSlug, productSlug: p.slug }}
              >
                {children}
              </Link>
            )}
          />
        </Box>
      </Box>
    </Box>
  )
}
