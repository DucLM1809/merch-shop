import type { JSX } from "react";

import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { OrderStatus } from "@/api/types";
import { useFormatPrice } from "@/i18n/useFormatPrice";
import { useLocale } from "@/i18n/useLocale";

import type { CartItem } from "@/store/cart";

type Props = {
  orderId?: string;
  status?: OrderStatus;
  isResolving?: boolean;
  items: CartItem[];
};

// This page lives in the orders module but is the last step of checkout — it is reached from
// the checkout route and nowhere else — so its copy sits in the `checkout` namespace with the
// rest of that flow. The order history and detail screens are the orders namespace's job.
export function OrderConfirmationPage({ orderId, status, isResolving, items }: Props): JSX.Element {
  const { t } = useTranslation("checkout");
  const formatPrice = useFormatPrice();
  const locale = useLocale();

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <Box p={8} maxW="2xl" mx="auto">
      <VStack gap={6} align="stretch">
        <Box>
          <Heading size="xl" color="white" fontWeight="800">
            {t("confirmation.title")}
          </Heading>
          <Text color="gray.400" mt={1} fontSize="sm">
            {orderId ? (
              <>
                {t("confirmation.orderId")}{" "}
                <Box as="span" color="white" fontWeight="700">
                  {orderId}
                </Box>
                {status && ` (${status})`}
              </>
            ) : isResolving ? (
              t("confirmation.resolving")
            ) : (
              t("confirmation.emailSoon")
            )}
          </Text>
        </Box>

        <Box>
          <Heading
            size="sm"
            color="gray.400"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.05em"
            mb={3}
          >
            {t("confirmation.itemsPurchased")}
          </Heading>
          <VStack gap={2} align="stretch">
            {items.map((item) => (
              <Flex
                key={item.skuId}
                justify="space-between"
                align="center"
                bg="gray.900"
                borderRadius="md"
                p={3}
              >
                <Box>
                  <Text color="white" fontWeight="600" fontSize="sm">
                    {item.productName}
                  </Text>
                  <Text color="gray.500" fontSize="xs">
                    {item.variant} × {item.quantity}
                  </Text>
                </Box>
                <Text color="white" fontWeight="700" fontSize="sm">
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </Flex>
            ))}
          </VStack>
        </Box>

        <Flex justify="space-between" pt={4} borderTop="1px solid" borderColor="gray.700">
          <Text color="gray.400" fontWeight="600" textTransform="uppercase" fontSize="sm">
            {t("confirmation.total")}
          </Text>
          <Text color="white" fontWeight="800" fontSize="xl">
            {formatPrice(total)}
          </Text>
        </Flex>

        <Button variant="outline" colorPalette="blue" asChild>
          <Link to="/$locale" params={{ locale }}>
            {t("confirmation.continueShopping")}
          </Link>
        </Button>
      </VStack>
    </Box>
  );
}
