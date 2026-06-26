import { useState } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import type { Order } from "@/api/types";

type Props = { orders: Order[] };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminOrdersView({ orders }: Props): React.JSX.Element {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (orders.length === 0) {
    return <Text color="gray.400">No orders yet.</Text>;
  }

  return (
    <Box border="1px solid" borderColor="gray.800" borderRadius="lg" overflow="hidden">
      <Flex px={4} py={3} bg="gray.900" borderBottom="1px solid" borderColor="gray.800">
        {(["Order", "Customer", "Date", "Total"] as const).map((col, i) => (
          <Text
            key={col}
            flex={[1.5, 2, 1.5, 1][i]}
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
          </Flex>

          {expanded === order.id && (
            <Flex
              px={4}
              py={4}
              gap={8}
              bg="gray.950"
              borderBottom={i < orders.length - 1 ? "1px solid" : "none"}
              borderColor="gray.800"
            >
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
          )}
        </Box>
      ))}
    </Box>
  );
}
