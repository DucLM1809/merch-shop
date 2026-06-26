import { createFileRoute } from "@tanstack/react-router";
import { Box, Heading, HStack, Text } from "@chakra-ui/react";

import { AdminOrdersView } from "@/modules/admin";
import { useAdminOrders } from "@/modules/orders";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

function AdminOrdersPage(): React.JSX.Element {
  const { data: orders = [], isLoading, error } = useAdminOrders();

  return (
    <Box p={8}>
      <HStack mb={6} justify="space-between">
        <Heading size="lg" color="white">
          Orders
        </Heading>
        {!isLoading && (
          <Box
            px={3}
            py={1}
            borderRadius="full"
            bg="gray.800"
            color="gray.400"
            fontSize="xs"
            fontWeight="700"
          >
            {orders.length} total
          </Box>
        )}
      </HStack>

      {isLoading && <Text color="gray.500">Loading…</Text>}
      {error && <Text color="red.400">Failed to load orders.</Text>}
      {!isLoading && !error && <AdminOrdersView orders={orders} />}
    </Box>
  );
}
