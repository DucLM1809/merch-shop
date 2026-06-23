import { Box, Button, Flex, Heading, IconButton, Text } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import type { CartItem } from '../../store/cart'
import { getSubtotal } from '../../store/cart'

interface Props {
  items: CartItem[]
  onUpdateQuantity: (skuId: string, quantity: number) => void
  onRemove: (skuId: string) => void
}

export function CartView({ items, onUpdateQuantity, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <Box p={8} textAlign="center" pt={20}>
        <Text color="gray.500" fontSize="lg" fontWeight="600">Your cart is empty</Text>
        <Text color="gray.600" fontSize="sm" mt={1} mb={6}>
          Add some gear to get started
        </Text>
        <Button variant="outline" colorPalette="blue" asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </Box>
    )
  }

  const subtotal = getSubtotal(items)

  return (
    <Box p={8} maxW="3xl" mx="auto">
      <Flex align="baseline" gap={3} mb={6}>
        <Heading size="xl" color="white" fontWeight="800" letterSpacing="-0.025em">
          Cart
        </Heading>
        <Text fontSize="sm" color="gray.500" fontWeight="600">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </Text>
      </Flex>

      <Flex direction="column" gap={3}>
        {items.map((item) => (
          <Flex
            key={item.skuId}
            bg="gray.900"
            borderRadius="lg"
            p={4}
            gap={4}
            align="center"
            borderTop="1px solid"
            borderColor="gray.800"
            transition="border-color 0.15s"
            _hover={{ borderColor: 'gray.700' }}
          >
            <Box flex="1" minW={0}>
              <Text color="white" fontWeight="600" truncate fontSize="sm">
                {item.productName}
              </Text>
              <Text color="gray.500" fontSize="xs" mt={0.5} textTransform="uppercase" letterSpacing="0.05em">
                {item.variant}
              </Text>
              <Text color="gray.400" fontSize="sm" mt={1} fontWeight="600">
                ${item.price.toFixed(2)}
              </Text>
            </Box>

            <Flex align="center" gap={1}>
              <IconButton
                size="sm"
                variant="ghost"
                colorPalette="gray"
                aria-label="Decrease quantity"
                onClick={() => onUpdateQuantity(item.skuId, item.quantity - 1)}
              >
                -
              </IconButton>
              <Text color="white" minW={6} textAlign="center" fontWeight="700" fontSize="sm">
                {item.quantity}
              </Text>
              <IconButton
                size="sm"
                variant="ghost"
                colorPalette="gray"
                aria-label="Increase quantity"
                onClick={() => onUpdateQuantity(item.skuId, item.quantity + 1)}
              >
                +
              </IconButton>
            </Flex>

            <Text color="white" fontWeight="700" minW={16} textAlign="right" fontSize="sm">
              ${(item.price * item.quantity).toFixed(2)}
            </Text>

            <Button
              size="sm"
              variant="ghost"
              colorPalette="red"
              aria-label="Remove"
              onClick={() => onRemove(item.skuId)}
              fontSize="xs"
            >
              Remove
            </Button>
          </Flex>
        ))}
      </Flex>

      <Flex
        justify="space-between"
        align="center"
        mt={6}
        pt={5}
        borderTop="1px solid"
        borderColor="gray.700"
      >
        <Text color="gray.500" fontSize="sm" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em">
          Subtotal
        </Text>
        <Text
          color="white"
          fontSize="2xl"
          fontWeight="800"
          letterSpacing="-0.02em"
          data-testid="cart-subtotal"
        >
          ${subtotal.toFixed(2)}
        </Text>
      </Flex>

      <Button
        w="full"
        mt={5}
        size="lg"
        colorPalette="blue"
        fontWeight="700"
        letterSpacing="0.02em"
      >
        Proceed to Checkout
      </Button>
    </Box>
  )
}
