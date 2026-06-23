import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Flex,
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
  onAddToCart?: (sku: SKU) => void
}

function uniqueValues(skus: SKU[], key: keyof SKU): string[] {
  return [...new Set(skus.map((s) => s[key] as string).filter(Boolean))]
}

function isOptionAvailable(skus: SKU[], key: keyof SKU, value: string): boolean {
  return skus.some((s) => s[key] === value && s.available)
}

function DimButton({
  label,
  available,
  selected,
  onToggle,
}: {
  label: string
  available: boolean
  selected: boolean
  onToggle: () => void
}) {
  return (
    <WrapItem>
      <Button
        size="sm"
        variant={selected ? 'solid' : 'outline'}
        colorPalette={selected ? 'blue' : 'gray'}
        disabled={!available}
        aria-pressed={selected}
        aria-disabled={!available}
        opacity={!available ? 0.3 : 1}
        textDecoration={!available ? 'line-through' : 'none'}
        onClick={() => available && onToggle()}
      >
        {label}
      </Button>
    </WrapItem>
  )
}

export function ProductDetailView({ product, isLoading, isError, onAddToCart }: ProductDetailViewProps) {
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
      <Box p={8} maxW="5xl" mx="auto">
        <Flex gap={8} direction={{ base: 'column', md: 'row' }}>
          <Box flex={{ base: '1', md: '0 0 52%' }}>
            <Skeleton h="96" borderRadius="xl" />
          </Box>
          <Box flex="1">
            <Skeleton h="10" w="3/4" mb={4} />
            <Skeleton h="4" w="full" mb={2} />
            <Skeleton h="4" w="2/3" mb={6} />
            <Skeleton h="8" w="28" mb={8} />
            <Skeleton h="12" w="full" />
          </Box>
        </Flex>
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
  const accent = product.accentColor ?? '#0094e0'

  return (
    <Box p={{ base: 6, md: 8 }} maxW="5xl" mx="auto">
      <Flex gap={8} direction={{ base: 'column', md: 'row' }} align="flex-start">
        {/* Image */}
        <Box flex={{ base: '1', md: '0 0 52%' }}>
          {product.imageUrl ? (
            <Box
              borderRadius="xl"
              overflow="hidden"
              bg="gray.900"
              h={{ base: '72', md: '96' }}
              position="relative"
              style={{ boxShadow: `0 0 0 1px ${accent}30, 0 24px 64px rgba(0,0,0,0.6)` }}
            >
              <Image src={product.imageUrl} alt={product.name} h="full" w="full" objectFit="cover" />
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                h="40%"
                pointerEvents="none"
                style={{ background: 'linear-gradient(to top, rgba(8,8,12,0.7), transparent)' }}
              />
            </Box>
          ) : (
            <Box
              borderRadius="xl"
              bg="gray.900"
              h={{ base: '72', md: '96' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px solid"
              borderColor="gray.800"
            >
              <Text color="gray.600" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                No image
              </Text>
            </Box>
          )}
        </Box>

        {/* Details */}
        <Box flex="1" minW={0} pt={{ base: 0, md: 2 }}>
          <Box
            h="3px"
            w="40px"
            borderRadius="full"
            mb={4}
            style={{ background: accent }}
          />

          <Heading as="h1" size="2xl" color="white" mb={2} fontWeight="800" letterSpacing="-0.03em" lineHeight="1.05">
            {product.name}
          </Heading>

          {product.description && (
            <Text color="gray.400" mb={5} fontSize="sm" lineHeight="relaxed">
              {product.description}
            </Text>
          )}

          <Text
            data-testid="product-price"
            color="white"
            fontSize="3xl"
            fontWeight="800"
            mb={6}
            letterSpacing="-0.03em"
          >
            ${displayPrice?.toFixed(2)}
          </Text>

          {sizes.length > 0 && (
            <Box mb={5}>
              <Text
                color="gray.400"
                fontSize="xs"
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.1em"
                fontWeight="700"
              >
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
            <Box mb={5}>
              <Text
                color="gray.400"
                fontSize="xs"
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.1em"
                fontWeight="700"
              >
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
            <Box mb={5}>
              <Text
                color="gray.400"
                fontSize="xs"
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.1em"
                fontWeight="700"
              >
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
            mt={6}
            colorPalette={canAddToCart ? 'blue' : 'gray'}
            disabled={!canAddToCart}
            aria-disabled={!canAddToCart}
            fontWeight="700"
            letterSpacing="0.02em"
            onClick={() => selectedSku && onAddToCart?.(selectedSku)}
          >
            Add to Cart
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}
