import type { JSX } from "react";

import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { OrderStatus } from "@/api/types";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { PageContainer } from "@/components/PageContainer";
import { useFormatPrice } from "@/i18n/useFormatPrice";
import { useLocale } from "@/i18n/useLocale";

import type { CartItem } from "@/store/cart";
import { ORDER_STATUS_KEY } from "../statusLabel";
import { ORDER_STATUS_TONE } from "../statusTone";

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
  // The order-status vocabulary itself (`status.PENDING`, etc.) belongs to the `orders`
  // namespace, unlike the rest of this page's copy — see `ORDER_STATUS_KEY`.
  const { t: tOrders } = useTranslation("orders");
  const formatPrice = useFormatPrice();
  const locale = useLocale();

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <PageContainer size="sm" py={8}>
      <VStack gap={6} align="stretch">
        <Card
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          gap={3}
          py={10}
          px={6}
        >
          <Flex
            w={14}
            h={14}
            borderRadius="full"
            bg="success.subtle"
            color="success.fg"
            align="center"
            justify="center"
            aria-hidden="true"
            data-testid="confirmation-success-icon"
          >
            <CheckCircle2 size={30} strokeWidth={1.75} />
          </Flex>

          <Heading textStyle="h1" color="fg">
            {t("confirmation.title")}
          </Heading>

          <Text color="fg.muted" fontSize="sm">
            {orderId ? (
              <>
                {t("confirmation.orderId")}{" "}
                <Box as="span" color="fg" fontWeight="700">
                  {orderId}
                </Box>
              </>
            ) : isResolving ? (
              t("confirmation.resolving")
            ) : (
              t("confirmation.emailSoon")
            )}
          </Text>

          {status && (
            <Badge tone={ORDER_STATUS_TONE[status]}>{tOrders(ORDER_STATUS_KEY[status])}</Badge>
          )}
        </Card>

        <Box>
          <Heading
            size="sm"
            color="fg.muted"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.05em"
            mb={3}
          >
            {t("confirmation.itemsPurchased")}
          </Heading>
          <VStack gap={3} align="stretch">
            {items.map((item) => (
              <Card
                key={item.skuId}
                as="article"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
              >
                <Box>
                  <Text color="fg" fontWeight="600" fontSize="sm">
                    {item.productName}
                  </Text>
                  <Text color="fg.subtle" fontSize="xs">
                    {item.variant} × {item.quantity}
                  </Text>
                </Box>
                <Text color="fg" fontWeight="700" fontSize="sm">
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </Card>
            ))}
          </VStack>
        </Box>

        <Flex justify="space-between" pt={4} borderTop="1px solid" borderColor="border.emphasized">
          <Text color="fg.muted" fontWeight="600" textTransform="uppercase" fontSize="sm">
            {t("confirmation.total")}
          </Text>
          <Text color="fg" fontWeight="800" fontSize="xl">
            {formatPrice(total)}
          </Text>
        </Flex>

        <Button variant="outline" colorPalette="blue" asChild>
          <Link to="/$locale" params={{ locale }}>
            {t("confirmation.continueShopping")}
          </Link>
        </Button>
      </VStack>
    </PageContainer>
  );
}
