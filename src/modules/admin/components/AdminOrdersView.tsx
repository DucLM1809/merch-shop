import { Fragment, useState } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { ShoppingBag } from "lucide-react";

import type { Order, OrderStatus } from "@/api/types";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { ORDER_STATUS_TONE, useRetryFulfillment } from "@/modules/orders";

import { AdminConfirmButton } from "./AdminConfirmButton";
import { AdminTable, AdminTableCell, AdminTableRow, type AdminColumn } from "./AdminTable";

type Props = { orders: Order[] };

const RETRYABLE_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED"];

const COLUMNS: AdminColumn[] = [
  { key: "order", label: "Order" },
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminOrdersView({ orders }: Props): React.JSX.Element {
  const [expanded, setExpanded] = useState<string | null>(null);
  const mutation = useRetryFulfillment();

  if (orders.length === 0) {
    return <EmptyState title="No orders yet." icon={<ShoppingBag size={28} strokeWidth={1.5} />} />;
  }

  const busy = (id: string) => mutation.isPending && mutation.variables === id;

  return (
    <AdminTable columns={COLUMNS}>
      {orders.map((order) => {
        const isExpanded = expanded === order.id;
        const toggle = () => setExpanded(isExpanded ? null : order.id);
        const handleRetry = () => mutation.mutate(order.id);

        return (
          <Fragment key={order.id}>
            <AdminTableRow clickable active={isExpanded} onClick={toggle}>
              <AdminTableCell>
                <Text fontSize="sm" fontWeight="600" color="fg" fontFamily="mono">
                  #{order.id}
                </Text>
              </AdminTableCell>
              <AdminTableCell>
                <Text fontSize="sm" color="fg">
                  {order.shipping?.fullName ?? "—"}
                </Text>
                <Text fontSize="xs" color="fg.subtle">
                  {order.shipping?.email ?? ""}
                </Text>
              </AdminTableCell>
              <AdminTableCell>
                <Text fontSize="sm" color="fg.muted">
                  {fmtDate(order.createdAt)}
                </Text>
              </AdminTableCell>
              <AdminTableCell>
                <Text fontSize="sm" fontWeight="600" color="fg">
                  {order.total !== undefined ? `$${order.total.toFixed(2)}` : "—"}
                </Text>
              </AdminTableCell>
              <AdminTableCell>
                <Box data-testid={`order-status-${order.id}`}>
                  <Badge tone={ORDER_STATUS_TONE[order.status]}>{order.status}</Badge>
                </Box>
              </AdminTableCell>
            </AdminTableRow>

            {isExpanded && (
              <AdminTableRow>
                <AdminTableCell colSpan={COLUMNS.length} bg="bg.subtle" py={5}>
                  <HStack gap={8} align="start">
                    <Box flex={1}>
                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        color="fg.muted"
                        textTransform="uppercase"
                        letterSpacing="0.08em"
                        mb={2}
                      >
                        Shipping
                      </Text>
                      {order.shipping ? (
                        <>
                          <Text fontSize="sm" color="fg">
                            {order.shipping.fullName}
                          </Text>
                          <Text fontSize="sm" color="fg.muted">
                            {order.shipping.line1}
                          </Text>
                          <Text fontSize="sm" color="fg.muted">
                            {order.shipping.city}, {order.shipping.country}
                          </Text>
                        </>
                      ) : (
                        <Text fontSize="sm" color="fg.subtle">
                          No shipping details available.
                        </Text>
                      )}
                    </Box>
                    <Box flex={2}>
                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        color="fg.muted"
                        textTransform="uppercase"
                        letterSpacing="0.08em"
                        mb={2}
                      >
                        Items
                      </Text>
                      <VStack gap={1} align="stretch">
                        {order.lines.map((line) => (
                          <HStack key={line.skuId} justify="space-between">
                            <Text fontSize="sm" color="fg">
                              {line.productName ?? line.skuId}
                              {line.variant ? ` · ${line.variant}` : ""} × {line.quantity}
                            </Text>
                            <Text fontSize="sm" color="fg.muted">
                              {line.price !== undefined
                                ? `$${(line.price * line.quantity).toFixed(2)}`
                                : "—"}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  </HStack>

                  {RETRYABLE_STATUSES.includes(order.status) && (
                    <AdminConfirmButton
                      mt={4}
                      size="sm"
                      colorPalette="blue"
                      variant="outline"
                      pending={busy(order.id)}
                      onConfirm={handleRetry}
                    >
                      Retry Fulfillment
                    </AdminConfirmButton>
                  )}
                </AdminTableCell>
              </AdminTableRow>
            )}
          </Fragment>
        );
      })}
    </AdminTable>
  );
}
