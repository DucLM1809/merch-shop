import { Box, Button, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { CartItem } from "@/store/cart";
import { getSubtotal } from "@/store/cart";
import { Card } from "@/components/Card";
import { PageContainer } from "@/components/PageContainer";
import { useFormatPrice } from "@/i18n/useFormatPrice";
import { useLocale } from "@/i18n/useLocale";

interface Props {
  items: CartItem[];
  onUpdateQuantity: (skuId: string, quantity: number) => void;
  onRemove: (skuId: string) => void;
}

export function CartView({ items, onUpdateQuantity, onRemove }: Props) {
  const { t } = useTranslation("cart");
  const formatPrice = useFormatPrice();
  const locale = useLocale();

  if (items.length === 0) {
    return (
      <Box p={8} textAlign="center" pt={20}>
        <Text color="fg.muted" fontSize="lg" fontWeight="600">
          {t("empty.title")}
        </Text>
        <Text color="fg.subtle" fontSize="sm" mt={1} mb={6}>
          {t("empty.hint")}
        </Text>
        <Button variant="outline" colorPalette="blue" asChild>
          <Link to="/$locale" params={{ locale }}>
            {t("empty.continueShopping")}
          </Link>
        </Button>
      </Box>
    );
  }

  const subtotal = getSubtotal(items);

  return (
    <PageContainer size="sm" py={8}>
      <Flex align="baseline" gap={3} mb={6}>
        <Heading textStyle="h1" color="fg">
          {t("title")}
        </Heading>
        <Text fontSize="sm" color="fg.muted" fontWeight="600">
          {t("itemCount", { count: items.length })}
        </Text>
      </Flex>

      <Flex direction="column" gap={3}>
        {items.map((item) => (
          <CartRow
            key={item.skuId}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </Flex>

      <Flex
        justify="space-between"
        align="center"
        mt={6}
        pt={5}
        borderTop="1px solid"
        borderColor="border.emphasized"
      >
        <Text
          color="fg.muted"
          fontSize="sm"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.05em"
        >
          {t("subtotal")}
        </Text>
        <Text
          color="fg"
          fontSize="2xl"
          fontWeight="800"
          letterSpacing="-0.02em"
          data-testid="cart-subtotal"
        >
          {formatPrice(subtotal)}
        </Text>
      </Flex>

      <Button
        w="full"
        mt={5}
        size="lg"
        colorPalette="blue"
        fontWeight="700"
        letterSpacing="0.02em"
        asChild
      >
        <Link to="/$locale/checkout" params={{ locale }}>
          {t("checkout")}
        </Link>
      </Button>
    </PageContainer>
  );
}

type CartRowProps = {
  item: CartItem;
  onUpdateQuantity: (skuId: string, quantity: number) => void;
  onRemove: (skuId: string) => void;
};

function CartRow({ item, onUpdateQuantity, onRemove }: CartRowProps) {
  const { t } = useTranslation("cart");
  const formatPrice = useFormatPrice();

  const handleDecrease = () => onUpdateQuantity(item.skuId, item.quantity - 1);
  const handleIncrease = () => onUpdateQuantity(item.skuId, item.quantity + 1);
  const handleRemove = () => onRemove(item.skuId);

  return (
    <Card as="article" interactive display="flex" alignItems="center" gap={4} p={4}>
      <Box flex="1" minW={0}>
        <Text color="fg" fontWeight="600" truncate fontSize="sm">
          {item.productName}
        </Text>
        <Text
          color="fg.subtle"
          fontSize="xs"
          mt={0.5}
          textTransform="uppercase"
          letterSpacing="0.05em"
        >
          {item.variant}
        </Text>
        <Text color="fg.muted" fontSize="sm" mt={1} fontWeight="600">
          {formatPrice(item.price)}
        </Text>
      </Box>

      <Flex align="center" gap={1}>
        <IconButton
          size="sm"
          variant="ghost"
          colorPalette="gray"
          aria-label={t("item.decreaseQuantity")}
          onClick={handleDecrease}
        >
          -
        </IconButton>
        <Text color="fg" minW={6} textAlign="center" fontWeight="700" fontSize="sm">
          {item.quantity}
        </Text>
        <IconButton
          size="sm"
          variant="ghost"
          colorPalette="gray"
          aria-label={t("item.increaseQuantity")}
          onClick={handleIncrease}
        >
          +
        </IconButton>
      </Flex>

      <Text color="fg" fontWeight="700" minW={16} textAlign="right" fontSize="sm">
        {formatPrice(item.price * item.quantity)}
      </Text>

      <Button
        size="sm"
        variant="ghost"
        colorPalette="danger"
        aria-label={t("item.remove")}
        onClick={handleRemove}
        fontSize="xs"
      >
        {t("item.remove")}
      </Button>
    </Card>
  );
}
