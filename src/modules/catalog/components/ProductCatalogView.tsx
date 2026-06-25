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
import type { Product } from '@/api/types'

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
            <Skeleton key={i} h="72" borderRadius="lg" />
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
  const accent = product.accentColor ?? '#1a9fff'

  const imageSection = (
    <Box h="52" bg="gray.800" overflow="hidden" position="relative">
      {product.imageUrl ? (
        <>
          <Image
            src={product.imageUrl}
            alt={product.name}
            h="full"
            w="full"
            objectFit="cover"
            transition="transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            _groupHover={{ transform: 'scale(1.06)' }}
          />
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            h="45%"
            pointerEvents="none"
            style={{ background: 'linear-gradient(to top, rgba(8,8,12,0.9), transparent)' }}
          />
        </>
      ) : (
        <Flex h="full" align="center" justify="center">
          <Text color="gray.600" fontSize="xs" letterSpacing="wider" textTransform="uppercase">
            No image
          </Text>
        </Flex>
      )}
    </Box>
  )

  const cardBody = (
    <>
      {imageSection}
      <Box p={4} pt={3}>
        <Heading size="sm" color="white" fontWeight="600" lineHeight="snug" mb={1.5}>
          {product.name}
        </Heading>
        <Text color="gray.300" fontWeight="700" fontSize="sm">
          ${product.price.toFixed(2)}
        </Text>
      </Box>
    </>
  )

  const cardStyles = {
    borderRadius: 'lg',
    overflow: 'hidden',
    position: 'relative' as const,
    borderTop: '2px solid',
    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s',
    role: 'group',
    _hover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 48px rgba(0,0,0,0.7)',
    },
    style: {
      borderTopColor: accent,
      background: `linear-gradient(180deg, ${accent}0d 0%, #0e0e12 28%)`,
    },
  }

  if (renderLink) {
    return (
      <LinkBox as="article" {...cardStyles}>
        {imageSection}
        <Box p={4} pt={3}>
          <LinkOverlay asChild>
            {renderLink(
              product,
              <Heading size="sm" color="white" fontWeight="600" lineHeight="snug" mb={1.5}>
                {product.name}
              </Heading>,
            )}
          </LinkOverlay>
          <Text color="gray.300" fontWeight="700" fontSize="sm">
            ${product.price.toFixed(2)}
          </Text>
        </Box>
      </LinkBox>
    )
  }

  return (
    <Box as="article" {...cardStyles}>
      {cardBody}
    </Box>
  )
}
