import { createLazyFileRoute } from "@tanstack/react-router";

import { Box, Button, Heading, HStack, Text } from "@chakra-ui/react";

import { ORDER_STATUSES, type OrderStatus } from "@/api/types";
import { PageContainer } from "@/components/PageContainer";
import { AdminOrdersView } from "@/modules/admin";
import { useAdminOrders } from "@/modules/orders";

export const Route = createLazyFileRoute("/$locale/(admin)/admin/orders")({
  component: AdminOrdersPage,
});

function AdminOrdersPage(): React.JSX.Element {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data: { orders, meta } = {}, isLoading, error } = useAdminOrders(search);
  // No route-level errorComponent here, so a response shape mismatch would otherwise
  // crash AdminOrdersView's orders.map() and blank the whole admin section.
  const safeOrders = Array.isArray(orders) ? orders : [];

  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / meta.limit)) : 1;
  const page = search.page ?? 1;

  function setStatus(status: OrderStatus | undefined): void {
    navigate({ search: (prev) => ({ ...prev, status, page: undefined }), replace: true });
  }

  function setPage(nextPage: number): void {
    navigate({ search: (prev) => ({ ...prev, page: nextPage }), replace: true });
  }

  return (
    <PageContainer size="lg" py={8}>
      <HStack mb={6} justify="space-between">
        <Heading textStyle="h1" color="fg">
          Orders
        </Heading>
        {meta && (
          <Box
            px={3}
            py={1}
            borderRadius="full"
            bg="bg.muted"
            color="fg.muted"
            fontSize="xs"
            fontWeight="700"
          >
            {meta.total} total
          </Box>
        )}
      </HStack>

      <HStack mb={5} gap={2}>
        <StatusChip label="All" selected={!search.status} onClick={() => setStatus(undefined)} />
        {ORDER_STATUSES.map((status) => (
          <StatusChip
            key={status}
            label={status}
            selected={search.status === status}
            onClick={() => setStatus(status)}
          />
        ))}
      </HStack>

      {isLoading && <Text color="fg.muted">Loading…</Text>}
      {error && <Text color="danger.fg">Failed to load orders.</Text>}
      {!isLoading && !error && <AdminOrdersView orders={safeOrders} />}

      {!isLoading && !error && totalPages > 1 && (
        <HStack mt={5} justify="center" gap={4}>
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Text fontSize="sm" color="fg.muted">
            Page {page} of {totalPages}
          </Text>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </HStack>
      )}
    </PageContainer>
  );
}

type StatusChipProps = { label: string; selected: boolean; onClick: () => void };

function StatusChip({ label, selected, onClick }: StatusChipProps): React.JSX.Element {
  return (
    <Button
      size="xs"
      variant={selected ? "solid" : "outline"}
      colorPalette={selected ? "blue" : "gray"}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
