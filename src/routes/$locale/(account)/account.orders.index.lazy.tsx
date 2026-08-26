import { useEffect } from "react";

import { Box, Flex, Heading, LinkBox, LinkOverlay, Text, VStack } from "@chakra-ui/react";
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { Order } from "@/api/types";
import { Badge } from "@/components/Badge";
import { useAuth } from "@/modules/account";
import { useFormatDate } from "@/i18n/useFormatDate";
import { useFormatPrice } from "@/i18n/useFormatPrice";
import { useLocale } from "@/i18n/useLocale";
import { ORDER_STATUS_KEY, ORDER_STATUS_TONE, OrdersLayout, useOrders } from "@/modules/orders";

/** Stands in for an amount the order wire shape didn't carry. */
const NO_AMOUNT = "—";

export const Route = createLazyFileRoute("/$locale/(account)/account/orders/")({
  component: AccountOrdersPage,
});

function AccountOrdersPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useTranslation("orders");
  const navigate = useNavigate();
  const locale = useLocale();

  useEffect(() => {
    if (isLoaded && !isSignedIn)
      navigate({
        to: "/$locale/sign-in",
        params: { locale },
        search: { redirect: `/${locale}/account/orders` },
      });
  }, [isLoaded, isSignedIn, locale, navigate]);

  const { data: orders = [] } = useOrders(!!isSignedIn);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <OrdersLayout>
      <Heading mb={6}>{t("history.title")}</Heading>
      {orders.length === 0 ? (
        <Text color="fg.muted">{t("history.empty")}</Text>
      ) : (
        <VStack gap={6} align="stretch">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </VStack>
      )}
    </OrdersLayout>
  );
}

function OrderCard({ order }: { order: Order }) {
  const { t } = useTranslation("orders");
  const formatDate = useFormatDate();
  const formatPrice = useFormatPrice();
  const locale = useLocale();

  return (
    <LinkBox
      as="article"
      data-testid={`order-row-${order.id}`}
      border="1px solid"
      borderColor="border"
      borderRadius="md"
      p={4}
      _hover={{ borderColor: "border.emphasized" }}
    >
      <Flex justify="space-between" align="start">
        <Box>
          <LinkOverlay asChild>
            <Link to="/$locale/account/orders/$orderId" params={{ locale, orderId: order.id }}>
              <Text fontWeight="bold">{t("orderNumber", { id: order.id })}</Text>
            </Link>
          </LinkOverlay>
          <Text color="fg.muted" fontSize="sm">
            {formatDate(order.createdAt)}
          </Text>
        </Box>
        <Box data-testid={`order-status-${order.id}`}>
          <Badge tone={ORDER_STATUS_TONE[order.status]}>{t(ORDER_STATUS_KEY[order.status])}</Badge>
        </Box>
      </Flex>
      <VStack mt={3} gap={1} align="stretch">
        {order.lines.map((line) => (
          <Text key={line.skuId} fontSize="sm">
            {line.productName ?? line.skuId} — {line.variant ?? "—"} × {line.quantity}
          </Text>
        ))}
      </VStack>
      <Text mt={3} fontWeight="semibold">
        {t("totalWithAmount", {
          amount: order.total !== undefined ? formatPrice(order.total) : NO_AMOUNT,
        })}
      </Text>
    </LinkBox>
  );
}
