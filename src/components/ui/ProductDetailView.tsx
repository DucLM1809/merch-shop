import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Heading,
  Image,
  Skeleton,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import type { Product, SKU } from '../../api/types'

export interface ProductDetailViewProps {
  product: Product | undefined
  isLoading: boolean
  isError: boolean
}

function uniqueValues(skus: SKU[], key: keyof SKU): string[] {
  return [...new Set(skus.map((s) => s[key] as string).filter(Boolean))]
}

function isOptionAvailable(skus: SKU[], key: keyof SKU, value: string): boolean {
  return skus.some((s) => s[key] === value && s.available)
}

export function ProductDetailView({ product, isLoading, isError }: ProductDetailViewProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null)

  const skus = product?.skus ?? []
  const sizes = useMemo(() => uniqueValues(skus, 'size'), [skus])
  const colors = useMemo(() => uniqueValues(skus, 'color'), [skus])
  const editions = useMemo(() => uniqueValues(skus, 'edition'), [skus])

  const selectedSku = useMemo(() => {
    if (!skus.length) return null
    return (
      skus.find(
        (s) =>
          (!sizes.length || s.size === selectedSize) &&
          (!colors.length || s.color === selectedColor) &&
          (!editions.length || s.edition === selectedEdition),
      ) ?? null
    )
  }, [skus, sizes, colors, editions, selectedSize, selectedColor, selectedEdition])

  const displayPrice = selectedSku?.price ?? product?.price

  if (isLoading) {
    return (
      <Box p={8} maxW="4xl" mx="auto">
        <Skeleton h="96" borderRadius="xl" mb={6} />
        <Skeleton h="8" w="64" mb={3} />
        <Skeleton h="4" w="full" mb={2} />
        <Skeleton h="4" w="3/4" />
      </Box>
    )
  }

  if (isError || !product) {
    return (
      <Box p={8}>
        <Text color="red.400">Failed to load product. Please try again.</Text>
      </Box>
    )
  }

  const canAddToCart = selectedSku?.available === true

  const DimButton = ({
    label,
    available,
    selected,
    onToggle,
  }: {
    label: string
    available: boolean
    selected: boolean
    onToggle: () => void
  }) => (
    <WrapItem>
      <Button
        size="sm"
        variant={selected ? 'solid' : 'outline'}
        disabled={!available}
        aria-pressed={selected}
        aria-disabled={!available}
        opacity={!available ? 0.35 : 1}
        textDecoration={!available ? 'line-through' : 'none'}
        onClick={() => available && onToggle()}
      >
        {label}
      </Button>
    </WrapItem>
  )

  return (
    <Box p={8} maxW="4xl" mx="auto">
      {product.imageUrl && (
        <Box borderRadius="xl" overflow="hidden" mb={6} bg="gray.900" h="96">
          <Image src={product.imageUrl} alt={product.name} h="full" w="full" objectFit="cover" />
        </Box>
      )}

      <Heading as="h1" size="xl" color="white" mb={2}>
        {product.name}
      </Heading>

      {product.description && (
        <Text color="gray.400" mb={4}>
          {product.description}
        </Text>
      )}

      <Text
        data-testid="product-price"
        color="white"
        fontSize="2xl"
        fontWeight="bold"
        mb={6}
      >
        ${displayPrice?.toFixed(2)}
      </Text>

      {sizes.length > 0 && (
        <Box mb={4}>
          <Text color="gray.400" fontSize="sm" mb={2} textTransform="uppercase" letterSpacing="wider">
            Size
          </Text>
          <Wrap>
            {sizes.map((size) => (
              <DimButton
                key={size}
                label={size}
                available={isOptionAvailable(skus, 'size', size)}
                selected={selectedSize === size}
                onToggle={() => setSelectedSize(selectedSize === size ? null : size)}
              />
            ))}
          </Wrap>
        </Box>
      )}

      {colors.length > 0 && (
        <Box mb={4}>
          <Text color="gray.400" fontSize="sm" mb={2} textTransform="uppercase" letterSpacing="wider">
            Color
          </Text>
          <Wrap>
            {colors.map((color) => (
              <DimButton
                key={color}
                label={color}
                available={isOptionAvailable(skus, 'color', color)}
                selected={selectedColor === color}
                onToggle={() => setSelectedColor(selectedColor === color ? null : color)}
              />
            ))}
          </Wrap>
        </Box>
      )}

      {editions.length > 0 && (
        <Box mb={4}>
          <Text color="gray.400" fontSize="sm" mb={2} textTransform="uppercase" letterSpacing="wider">
            Edition
          </Text>
          <Wrap>
            {editions.map((edition) => (
              <DimButton
                key={edition}
                label={edition}
                available={isOptionAvailable(skus, 'edition', edition)}
                selected={selectedEdition === edition}
                onToggle={() => setSelectedEdition(selectedEdition === edition ? null : edition)}
              />
            ))}
          </Wrap>
        </Box>
      )}

      <Button
        size="lg"
        w="full"
        mt={4}
        colorScheme={canAddToCart ? 'green' : 'gray'}
        disabled={!canAddToCart}
        aria-disabled={!canAddToCart}
      >
        Add to Cart
      </Button>
    </Box>
  )
}
