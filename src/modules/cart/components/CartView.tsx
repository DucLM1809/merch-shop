import { Box, Button, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { CartItem } from "@/store/cart";
import { getSubtotal } from "@/store/cart";
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
        <Text color="gray.500" fontSize="lg" fontWeight="600">
          {t("empty.title")}
        </Text>
        <Text color="gray.600" fontSize="sm" mt={1} mb={6}>
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
    <Box p={8} maxW="3xl" mx="auto">
      <Flex align="baseline" gap={3} mb={6}>
        <Heading size="xl" color="white" fontWeight="800" letterSpacing="-0.025em">
          {t("title")}
        </Heading>
        <Text fontSize="sm" color="gray.500" fontWeight="600">
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
        borderColor="gray.700"
      >
        <Text
          color="gray.500"
          fontSize="sm"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.05em"
        >
          {t("subtotal")}
        </Text>
        <Text
          color="white"
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
    </Box>
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
    <Flex
      bg="gray.900"
      borderRadius="lg"
      p={4}
      gap={4}
      align="center"
      borderTop="1px solid"
      borderColor="gray.800"
      transition="border-color 0.15s"
      _hover={{ borderColor: "gray.700" }}
    >
      <Box flex="1" minW={0}>
        <Text color="white" fontWeight="600" truncate fontSize="sm">
          {item.productName}
        </Text>
        <Text
          color="gray.500"
          fontSize="xs"
          mt={0.5}
          textTransform="uppercase"
          letterSpacing="0.05em"
        >
          {item.variant}
        </Text>
        <Text color="gray.400" fontSize="sm" mt={1} fontWeight="600">
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
        <Text color="white" minW={6} textAlign="center" fontWeight="700" fontSize="sm">
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

      <Text color="white" fontWeight="700" minW={16} textAlign="right" fontSize="sm">
        {formatPrice(item.price * item.quantity)}
      </Text>

      <Button
        size="sm"
        variant="ghost"
        colorPalette="red"
        aria-label={t("item.remove")}
        onClick={handleRemove}
        fontSize="xs"
      >
        {t("item.remove")}
      </Button>
    </Flex>
  );
}
