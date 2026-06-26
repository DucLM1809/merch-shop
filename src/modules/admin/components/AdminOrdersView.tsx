import { useState } from "react";
import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import type { Order, OrderStatus } from "@/api/types";
import { useUpdateOrderStatus } from "@/modules/orders";

type Props = { orders: Order[] };

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "orange.400",
  processing: "blue.400",
  shipped: "purple.400",
  delivered: "green.400",
  cancelled: "red.400",
  refunded: "gray.400",
};

const NEXT_STEP: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  pending: { label: "→ Processing", status: "processing" },
  processing: { label: "→ Shipped", status: "shipped" },
  shipped: { label: "→ Delivered", status: "delivered" },
};

const COLS = ["Order", "Customer", "Date", "Total", "Status"] as const;
const COL_FLEX = [1.5, 2, 1.5, 1, 1.5];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminOrdersView({ orders }: Props): React.JSX.Element {
  const [expanded, setExpanded] = useState<string | null>(null);
  const mutation = useUpdateOrderStatus();

  if (orders.length === 0) {
    return <Text color="gray.400">No orders yet.</Text>;
  }

  function act(id: string, status: OrderStatus) {
    mutation.mutate({ id, status });
  }

  const busy = (id: string) => mutation.isPending && mutation.variables?.id === id;

  return (
    <Box border="1px solid" borderColor="gray.800" borderRadius="lg" overflow="hidden">
      <Flex px={4} py={3} bg="gray.900" borderBottom="1px solid" borderColor="gray.800">
        {COLS.map((col, i) => (
          <Text
            key={col}
            flex={COL_FLEX[i]}
            fontSize="xs"
            fontWeight="700"
            color="gray.500"
            textTransform="uppercase"
            letterSpacing="0.08em"
          >
            {col}
          </Text>
        ))}
      </Flex>

      {orders.map((order, i) => (
        <Box key={order.id}>
          <Flex
            px={4}
            py={3.5}
            align="center"
            bg={expanded === order.id ? "gray.900" : "transparent"}
            _hover={{ bg: "gray.900" }}
            borderBottom={i < orders.length - 1 || expanded === order.id ? "1px solid" : "none"}
            borderColor="gray.800"
            cursor="pointer"
            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            transition="background 0.1s"
          >
            <Text flex={1.5} fontSize="sm" fontWeight="600" color="white" fontFamily="mono">
              #{order.id}
            </Text>
            <Box flex={2}>
              <Text fontSize="sm" color="white">
                {order.shipping.fullName}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {order.shipping.email}
              </Text>
            </Box>
            <Text flex={1.5} fontSize="sm" color="gray.400">
              {fmtDate(order.createdAt)}
            </Text>
            <Text flex={1} fontSize="sm" fontWeight="600" color="white">
              ${order.total.toFixed(2)}
            </Text>
            <Box flex={1.5}>
              <Text
                display="inline"
                fontSize="xs"
                fontWeight="700"
                color={STATUS_COLOR[order.status]}
                textTransform="uppercase"
                letterSpacing="0.06em"
              >
                {order.status}
              </Text>
            </Box>
          </Flex>

          {expanded === order.id && (
            <Flex
              px={4}
              py={4}
              gap={8}
              bg="gray.950"
              borderBottom={i < orders.length - 1 ? "1px solid" : "none"}
              borderColor="gray.800"
              direction="column"
            >
              <Flex gap={8}>
                <Box flex={1}>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    mb={2}
                  >
                    Shipping
                  </Text>
                  <Text fontSize="sm" color="gray.200">
                    {order.shipping.fullName}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    {order.shipping.line1}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    {order.shipping.city}, {order.shipping.country}
                  </Text>
                </Box>
                <Box flex={2}>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    mb={2}
                  >
                    Items
                  </Text>
                  <VStack gap={1} align="stretch">
                    {order.lines.map((line) => (
                      <Flex key={line.skuId} justify="space-between">
                        <Text fontSize="sm" color="gray.300">
                          {line.productName} · {line.variant} × {line.quantity}
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          ${(line.price * line.quantity).toFixed(2)}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              </Flex>

              {(NEXT_STEP[order.status] ||
                ["pending", "processing", "shipped"].includes(order.status) ||
                order.status === "delivered") && (
                <HStack gap={2}>
                  {NEXT_STEP[order.status] && (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      loading={busy(order.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        act(order.id, NEXT_STEP[order.status]!.status);
                      }}
                    >
                      {NEXT_STEP[order.status]!.label}
                    </Button>
                  )}
                  {(["pending", "processing", "shipped"] as OrderStatus[]).includes(
                    order.status
                  ) && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      loading={busy(order.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        act(order.id, "cancelled");
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  {order.status === "delivered" && (
                    <Button
                      size="sm"
                      colorScheme="gray"
                      variant="outline"
                      loading={busy(order.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        act(order.id, "refunded");
                      }}
                    >
                      Refund
                    </Button>
                  )}
                </HStack>
              )}
            </Flex>
          )}
        </Box>
      ))}
    </Box>
  );
}
