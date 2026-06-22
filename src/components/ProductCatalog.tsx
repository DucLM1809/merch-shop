import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Skeleton,
  Text,
} from '@chakra-ui/react'
import { client } from '../api/client'

export function ProductCatalog() {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => client.getProducts(),
  })

  if (isLoading) {
    return (
      <Box p={8}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} h="64" borderRadius="lg" />
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

  return (
    <Box p={8}>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
        {products?.map((product) => (
          <LinkBox
            key={product.id}
            as="article"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.700"
            bg="gray.900"
            p={4}
            transition="border-color 0.2s"
            _hover={{ borderColor: 'gray.500' }}
          >
            <Box mb={4} h="48" borderRadius="md" bg="gray.800">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  h="full"
                  w="full"
                  borderRadius="md"
                  objectFit="cover"
                />
              )}
            </Box>
            <LinkOverlay href={`/products/${product.slug}`}>
              <Heading size="sm" color="white">
                {product.name}
              </Heading>
            </LinkOverlay>
            <Text mt={1} color="gray.400">
              ${product.price.toFixed(2)}
            </Text>
          </LinkBox>
        ))}
      </SimpleGrid>
    </Box>
  )
}
