import { useEffect } from 'react'

import { useAuth } from '@clerk/react'
import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import type { Order } from '@/api/types'
import { useOrders } from '@/modules/orders'

export const Route = createFileRoute('/account/orders')({
  component: AccountOrdersPage,
})

function AccountOrdersPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && !isSignedIn) navigate({ to: '/sign-in' })
  }, [isLoaded, isSignedIn, navigate])

  const { data: orders = [] } = useOrders(!!isSignedIn)

  if (!isLoaded || !isSignedIn) return null

  return (
    <Box p={8} maxW="800px" mx="auto">
      <Heading mb={6}>Order History</Heading>
      {orders.length === 0 ? (
        <Text color="gray.400">No orders yet.</Text>
      ) : (
        <VStack gap={6} align="stretch">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </VStack>
      )}
    </Box>
  )
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Box border="1px solid" borderColor="gray.700" borderRadius="md" p={4}>
      <Text fontWeight="bold">Order #{order.id}</Text>
      <Text color="gray.400" fontSize="sm">
        {new Date(order.createdAt).toLocaleDateString()}
      </Text>
      <VStack mt={3} gap={1} align="stretch">
        {order.lines.map((line) => (
          <Text key={line.skuId} fontSize="sm">
            {line.productName} — {line.variant} × {line.quantity}
          </Text>
        ))}
      </VStack>
      <Text mt={3} fontWeight="semibold">
        Total: ${order.total.toFixed(2)}
      </Text>
    </Box>
  )
}
