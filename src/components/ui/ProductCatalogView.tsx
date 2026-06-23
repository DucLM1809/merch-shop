import { type ReactNode } from 'react'
import {
  Box,
  Flex,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Skeleton,
  Text,
} from '@chakra-ui/react'
import type { Product } from '../../api/types'

export interface ProductCatalogViewProps {
  products: Product[] | undefined
  isLoading: boolean
  isError: boolean
  renderLink?: (product: Product, children: ReactNode) => ReactNode
}

export function ProductCatalogView({ products, isLoading, isError, renderLink }: ProductCatalogViewProps) {
  if (isLoading) {
    return (
      <Box p={8}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={5}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} h="72" borderRadius="xl" />
          ))}
        </SimpleGrid>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box p={8}>
        <Text color="red.400">Failed to load products. Please try again.</Text>
      </Box>
    )
  }

  if (!products?.length) {
    return (
      <Box p={8} textAlign="center" py={20}>
        <Text color="gray.500" fontSize="lg">No products found.</Text>
        <Text color="gray.600" fontSize="sm" mt={1}>Check back soon for new merch.</Text>
      </Box>
    )
  }

  return (
    <Box p={8}>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={5}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} renderLink={renderLink} />
        ))}
      </SimpleGrid>
    </Box>
  )
}

function ProductCard({
  product,
  renderLink,
}: {
  product: Product
  renderLink?: (product: Product, children: ReactNode) => ReactNode
}) {
  const imageSection = (
    <Box h="56" bg="gray.800" overflow="hidden" position="relative">
      {product.imageUrl ? (
        <Image src={product.imageUrl} alt={product.name} h="full" w="full" objectFit="cover" />
      ) : (
        <Flex h="full" align="center" justify="center">
          <Text color="gray.600" fontSize="xs" letterSpacing="wider" textTransform="uppercase">
            No image
          </Text>
        </Flex>
      )}
    </Box>
  )

  const heading = (
    <Heading size="sm" color="white" fontWeight="600" lineHeight="snug" mb={1}>
      {product.name}
    </Heading>
  )

  const priceText = (
    <Text color="gray.300" fontWeight="600" fontSize="sm">
      ${product.price.toFixed(2)}
    </Text>
  )

  if (renderLink) {
    return (
      <LinkBox
        as="article"
        borderRadius="xl"
        bg="gray.900"
        overflow="hidden"
        transition="transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s"
        _hover={{ transform: 'translateY(-3px)', boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}
      >
        {imageSection}
        <Box p={4} pt={3}>
          <LinkOverlay asChild>
            {renderLink(product, heading)}
          </LinkOverlay>
          {priceText}
        </Box>
      </LinkBox>
    )
  }

  return (
    <Box
      as="article"
      borderRadius="xl"
      bg="gray.900"
      overflow="hidden"
      transition="transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s"
      _hover={{ transform: 'translateY(-3px)', boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}
    >
      {imageSection}
      <Box p={4} pt={3}>
        {heading}
        {priceText}
      </Box>
    </Box>
  )
}
