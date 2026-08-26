import { useEffect } from "react";
import type { JSX } from "react";

import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/Badge";
import { useFormatDate } from "@/i18n/useFormatDate";
import { useFormatPrice } from "@/i18n/useFormatPrice";
import { useLocale } from "@/i18n/useLocale";
import { useAuth } from "@/modules/account";

import { useOrder } from "../hooks";
import { ORDER_STATUS_KEY } from "../statusLabel";
import { ORDER_STATUS_TONE } from "../statusTone";
import { OrdersLayout } from "./OrdersLayout";

/** Stands in for an amount the order wire shape didn't carry. */
const NO_AMOUNT = "—";

type Props = {
  orderId: string;
};

export function OrderDetailPage({ orderId }: Props): JSX.Element | null {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useTranslation("orders");
  const navigate = useNavigate();
  const formatDate = useFormatDate();
  const formatPrice = useFormatPrice();
  const locale = useLocale();

  useEffect(() => {
    if (isLoaded && !isSignedIn)
      navigate({
        to: "/$locale/sign-in",
        params: { locale },
        search: { redirect: `/${locale}/account/orders/${orderId}` },
      });
  }, [isLoaded, isSignedIn, locale, navigate, orderId]);

  const { data: order, isLoading, error } = useOrder(orderId, !!isSignedIn);

  if (!isLoaded || !isSignedIn) return null;

  if (isLoading) {
    return (
      <OrdersLayout>
        <Text color="gray.400">{t("loading")}</Text>
      </OrdersLayout>
    );
  }

  if (error || !order) {
    return (
      <OrdersLayout>
        <Text color="red.400">{t("notFound")}</Text>
      </OrdersLayout>
    );
  }

  return (
    <OrdersLayout>
      <Link to="/$locale/account/orders" params={{ locale }}>
        <Text color="gray.400" fontSize="sm" mb={4} _hover={{ color: "white" }}>
          ← {t("backToHistory")}
        </Text>
      </Link>

      <Flex justify="space-between" align="start" mt={4} mb={1}>
        <Heading>{t("orderNumber", { id: order.id })}</Heading>
        <Box data-testid="order-status">
          <Badge tone={ORDER_STATUS_TONE[order.status]}>{t(ORDER_STATUS_KEY[order.status])}</Badge>
        </Box>
      </Flex>

      <Text color="gray.400" fontSize="sm" mb={6}>
        {t("placed", { date: formatDate(order.createdAt) })}
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
          {t("items")}
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
                  {line.productName ?? line.skuId}
                </Text>
                <Text color="gray.500" fontSize="xs">
                  {line.variant ?? "—"} × {line.quantity}
                </Text>
              </Box>
              <Text color="white" fontWeight="700" fontSize="sm">
                {line.price !== undefined ? formatPrice(line.price * line.quantity) : NO_AMOUNT}
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
          {t("shipping")}
        </Heading>
        {order.shipping ? (
          <>
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
          </>
        ) : (
          <Text fontSize="sm" color="gray.500">
            {t("noShipping")}
          </Text>
        )}
      </Box>

      <Flex justify="space-between" pt={4} borderTop="1px solid" borderColor="gray.700">
        <Text color="gray.400" fontWeight="600" textTransform="uppercase" fontSize="sm">
          {t("total")}
        </Text>
        <Text data-testid="order-total" color="white" fontWeight="800" fontSize="xl">
          {order.total !== undefined ? formatPrice(order.total) : NO_AMOUNT}
        </Text>
      </Flex>
    </OrdersLayout>
  );
}
