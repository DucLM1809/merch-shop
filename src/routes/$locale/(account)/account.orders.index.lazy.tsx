import { useEffect } from "react";

import { Box, Flex, Heading, LinkBox, LinkOverlay, Text, VStack } from "@chakra-ui/react";
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { Order } from "@/api/types";
import { useAuth } from "@/modules/account";
import { useFormatDate } from "@/i18n/useFormatDate";
import { useFormatPrice } from "@/i18n/useFormatPrice";
import { useLocale } from "@/i18n/useLocale";
import { ORDER_STATUS_COLOR, ORDER_STATUS_KEY, useOrders } from "@/modules/orders";

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
    <Box p={8} maxW="800px" mx="auto">
      <Heading mb={6}>{t("history.title")}</Heading>
      {orders.length === 0 ? (
        <Text color="gray.400">{t("history.empty")}</Text>
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
  const { t } = useTranslation("orders");
  const formatDate = useFormatDate();
  const formatPrice = useFormatPrice();
  const locale = useLocale();

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
            <Link to="/$locale/account/orders/$orderId" params={{ locale, orderId: order.id }}>
              <Text fontWeight="bold">{t("orderNumber", { id: order.id })}</Text>
            </Link>
          </LinkOverlay>
          <Text color="gray.400" fontSize="sm">
            {formatDate(order.createdAt)}
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
          {t(ORDER_STATUS_KEY[order.status])}
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
        {t("totalWithAmount", {
          amount: order.total !== undefined ? formatPrice(order.total) : NO_AMOUNT,
        })}
      </Text>
    </LinkBox>
  );
}
