import { createFileRoute } from '@tanstack/react-router'
import { Box, Heading, Text } from '@chakra-ui/react'
import { ProductCatalog } from '../components/ProductCatalog'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <Box minH="100dvh">
      <Box px={8} pt={8} pb={4} borderBottom="1px solid" borderColor="gray.700">
        <Heading size="xl" color="white" fontWeight="700" letterSpacing="-0.02em">
          All Products
        </Heading>
        <Text color="gray.500" fontSize="sm" mt={1}>
          Browse the full merch catalog
        </Text>
      </Box>
      <ProductCatalog />
    </Box>
  )
}
