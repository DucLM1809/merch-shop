import { Box, Button, Flex, Heading, IconButton, Text } from '@chakra-ui/react'
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
      <Box p={8} textAlign="center">
        <Text color="gray.400" fontSize="lg">Your cart is empty</Text>
        <Button mt={4} variant="outline" asChild>
          <a href="/">Continue Shopping</a>
        </Button>
      </Box>
    )
  }

  const subtotal = getSubtotal(items)

  return (
    <Box p={8} maxW="3xl" mx="auto">
      <Heading size="xl" color="white" mb={6}>Cart</Heading>

      <Flex direction="column" gap={4}>
        {items.map((item) => (
          <Flex
            key={item.skuId}
            bg="gray.900"
            borderRadius="lg"
            p={4}
            gap={4}
            align="center"
          >
            <Box flex="1" minW={0}>
              <Text color="white" fontWeight="semibold" truncate>{item.productName}</Text>
              <Text color="gray.400" fontSize="sm">{item.variant}</Text>
              <Text color="gray.300" fontSize="sm" mt={1}>${item.price.toFixed(2)} each</Text>
            </Box>

            <Flex align="center" gap={2}>
              <IconButton
                size="sm"
                variant="outline"
                aria-label="Decrease quantity"
                onClick={() => onUpdateQuantity(item.skuId, item.quantity - 1)}
              >
                −
              </IconButton>
              <Text color="white" minW={6} textAlign="center">{item.quantity}</Text>
              <IconButton
                size="sm"
                variant="outline"
                aria-label="Increase quantity"
                onClick={() => onUpdateQuantity(item.skuId, item.quantity + 1)}
              >
                +
              </IconButton>
            </Flex>

            <Text color="white" fontWeight="bold" minW={16} textAlign="right">
              {`$${(item.price * item.quantity).toFixed(2)}`}
            </Text>

            <Button
              size="sm"
              variant="ghost"
              colorPalette="red"
              aria-label="Remove"
              onClick={() => onRemove(item.skuId)}
            >
              Remove
            </Button>
          </Flex>
        ))}
      </Flex>

      <Flex justify="flex-end" mt={6} pt={4} borderTop="1px solid" borderColor="gray.700">
        <Flex direction="column" align="flex-end" gap={1}>
          <Text color="gray.400" fontSize="sm">Subtotal</Text>
          <Text color="white" fontSize="2xl" fontWeight="bold" data-testid="cart-subtotal">{`$${subtotal.toFixed(2)}`}</Text>
        </Flex>
      </Flex>

      <Button w="full" mt={6} size="lg" colorPalette="green">
        Proceed to Checkout
      </Button>
    </Box>
  )
}
