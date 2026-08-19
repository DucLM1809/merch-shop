import { useEffect } from "react";

import { Box, Flex, Heading, LinkBox, LinkOverlay, Text, VStack } from "@chakra-ui/react";
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";

import type { Order } from "@/api/types";
import { useAuth } from "@/modules/account";
import { ORDER_STATUS_COLOR, useOrders } from "@/modules/orders";

export const Route = createLazyFileRoute("/(account)/account/orders/")({
  component: AccountOrdersPage,
});

function AccountOrdersPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn)
      navigate({ to: "/sign-in", search: { redirect: "/account/orders" } });
  }, [isLoaded, isSignedIn, navigate]);

  const { data: orders = [] } = useOrders(!!isSignedIn);

  if (!isLoaded || !isSignedIn) return null;

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
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <LinkBox
      as="article"
      data-testid={`order-row-${order.id}`}
      border="1px solid"
      borderColor="gray.700"
      borderRadius="md"
      p={4}
      _hover={{ borderColor: "gray.500" }}
    >
      <Flex justify="space-between" align="start">
        <Box>
          <LinkOverlay asChild>
            <Link to="/account/orders/$orderId" params={{ orderId: order.id }}>
              <Text fontWeight="bold">Order #{order.id}</Text>
            </Link>
          </LinkOverlay>
          <Text color="gray.400" fontSize="sm">
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </Box>
        <Text
          data-testid={`order-status-${order.id}`}
          fontSize="xs"
          fontWeight="700"
          color={ORDER_STATUS_COLOR[order.status]}
          textTransform="uppercase"
          letterSpacing="0.06em"
        >
          {order.status}
        </Text>
      </Flex>
      <VStack mt={3} gap={1} align="stretch">
        {order.lines.map((line) => (
          <Text key={line.skuId} fontSize="sm">
            {line.productName ?? line.skuId} — {line.variant ?? "—"} × {line.quantity}
          </Text>
        ))}
      </VStack>
      <Text mt={3} fontWeight="semibold">
        Total: {order.total !== undefined ? `$${order.total.toFixed(2)}` : "—"}
      </Text>
    </LinkBox>
  );
}
