import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Box, Heading, Text } from '@chakra-ui/react'
import { ProductCatalog } from '../components/ProductCatalog'
import { FacetFilter } from '../components/FacetFilter'

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
      <Box px={8} pt={8} pb={4} borderBottom="1px solid" borderColor="gray.700">
        <Heading size="xl" color="white" fontWeight="700" letterSpacing="-0.02em">
          All Products
        </Heading>
        <Text color="gray.500" fontSize="sm" mt={1}>
          Browse the full merch catalog
        </Text>
      </Box>
      <Box display="flex" flex="1">
        <FacetFilter />
        <Box flex="1" minW={0}>
          <ProductCatalog filters={{ game, team, character }} />
        </Box>
      </Box>
    </Box>
  )
}
