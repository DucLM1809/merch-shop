import { useEffect } from "react";
import type { JSX } from "react";

import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from "@tanstack/react-router";

import { useAuth } from "@/modules/account";

import { useOrder } from "../hooks";
import { ORDER_STATUS_COLOR } from "../statusColor";

type Props = {
  orderId: string;
};

export function OrderDetailPage({ orderId }: Props): JSX.Element | null {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn)
      navigate({ to: "/sign-in", search: { redirect: `/account/orders/${orderId}` } });
  }, [isLoaded, isSignedIn, navigate, orderId]);

  const { data: order, isLoading, error } = useOrder(orderId, !!isSignedIn);

  if (!isLoaded || !isSignedIn) return null;

  if (isLoading) {
    return (
      <Box p={8} maxW="800px" mx="auto">
        <Text color="gray.400">Loading order…</Text>
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box p={8} maxW="800px" mx="auto">
        <Text color="red.400">Order not found.</Text>
      </Box>
    );
  }

  return (
    <Box p={8} maxW="800px" mx="auto">
      <Link to="/account/orders">
        <Text color="gray.400" fontSize="sm" mb={4} _hover={{ color: "white" }}>
          ← Back to Order History
        </Text>
      </Link>

      <Flex justify="space-between" align="start" mt={4} mb={1}>
        <Heading>Order #{order.id}</Heading>
        <Text
          data-testid="order-status"
          fontSize="sm"
          fontWeight="700"
          color={ORDER_STATUS_COLOR[order.status]}
          textTransform="uppercase"
          letterSpacing="0.06em"
        >
          {order.status}
        </Text>
      </Flex>

      <Text color="gray.400" fontSize="sm" mb={6}>
        Placed {new Date(order.createdAt).toLocaleDateString()}
      </Text>

      <Box mb={6}>
        <Heading
          size="sm"
          color="gray.400"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.05em"
          mb={3}
        >
          Items
        </Heading>
        <VStack gap={2} align="stretch">
          {order.lines.map((line) => (
            <Flex
              key={line.skuId}
              justify="space-between"
              align="center"
              bg="gray.900"
              borderRadius="md"
              p={3}
            >
              <Box>
                <Text color="white" fontWeight="600" fontSize="sm">
                  {line.productName}
                </Text>
                <Text color="gray.500" fontSize="xs">
                  {line.variant} × {line.quantity}
                </Text>
              </Box>
              <Text color="white" fontWeight="700" fontSize="sm">
                ${(line.price * line.quantity).toFixed(2)}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Box>

      <Box mb={6}>
        <Heading
          size="sm"
          color="gray.400"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.05em"
          mb={3}
        >
          Shipping
        </Heading>
        <Text fontSize="sm" color="gray.200">
          {order.shipping.fullName}
        </Text>
        <Text fontSize="sm" color="gray.400">
          {order.shipping.line1}
        </Text>
        <Text fontSize="sm" color="gray.400">
          {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
        </Text>
        <Text fontSize="sm" color="gray.400">
          {order.shipping.country}
        </Text>
      </Box>

      <Flex justify="space-between" pt={4} borderTop="1px solid" borderColor="gray.700">
        <Text color="gray.400" fontWeight="600" textTransform="uppercase" fontSize="sm">
          Total
        </Text>
        <Text data-testid="order-total" color="white" fontWeight="800" fontSize="xl">
          ${order.total.toFixed(2)}
        </Text>
      </Flex>
    </Box>
  );
}
