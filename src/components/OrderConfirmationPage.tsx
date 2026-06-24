import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { Route } from '../routes/order-confirmation'
import type { CartItem } from '../store/cart'

export function OrderConfirmationPage() {
  const { orderId, items: itemsJson } = Route.useSearch()
  const items: CartItem[] = JSON.parse(itemsJson)
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <Box p={8} maxW="2xl" mx="auto">
      <VStack gap={6} align="stretch">
        <Box>
          <Heading size="xl" color="white" fontWeight="800">Order Confirmed</Heading>
          <Text color="gray.400" mt={1} fontSize="sm">
            Order ID: <Box as="span" color="white" fontWeight="700">{orderId}</Box>
          </Text>
        </Box>

        <Box>
          <Heading size="sm" color="gray.400" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em" mb={3}>
            Items Purchased
          </Heading>
          <VStack gap={2} align="stretch">
            {items.map((item) => (
              <Flex
                key={item.skuId}
                justify="space-between"
                align="center"
                bg="gray.900"
                borderRadius="md"
                p={3}
              >
                <Box>
                  <Text color="white" fontWeight="600" fontSize="sm">{item.productName}</Text>
                  <Text color="gray.500" fontSize="xs">{item.variant} × {item.quantity}</Text>
                </Box>
                <Text color="white" fontWeight="700" fontSize="sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </Flex>
            ))}
          </VStack>
        </Box>

        <Flex justify="space-between" pt={4} borderTop="1px solid" borderColor="gray.700">
          <Text color="gray.400" fontWeight="600" textTransform="uppercase" fontSize="sm">Total</Text>
          <Text color="white" fontWeight="800" fontSize="xl">${total.toFixed(2)}</Text>
        </Flex>

        <Button variant="outline" colorPalette="blue" asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </VStack>
    </Box>
  )
}
