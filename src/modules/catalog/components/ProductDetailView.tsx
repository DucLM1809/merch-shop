import { useMemo, useState, type ReactNode } from "react";
import { Box, Button, Flex, Heading, Skeleton, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { ImageOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Product, SKU } from "@/api/types";
import { Breadcrumb, type BreadcrumbItem } from "@/components/Breadcrumb";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { OptimizedImage } from "@/components/OptimizedImage";
import { PageContainer } from "@/components/PageContainer";
import { QueryError } from "@/components/QueryError";
import { toaster } from "@/components/Toaster";
import { useFormatPrice } from "@/i18n/useFormatPrice";

const HERO_IMAGE_WIDTH = 960;
const THUMB_IMAGE_WIDTH = 160;

type RenderBreadcrumbLink = (
  to: string,
  params: Record<string, string> | undefined,
  label: string
) => ReactNode;

export interface ProductDetailViewProps {
  product: Product | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  onAddToCart?: (sku: SKU, quantity: number) => void | Promise<void>;
  breadcrumbItems?: BreadcrumbItem[];
  renderBreadcrumbLink?: RenderBreadcrumbLink;
}

function uniqueValues(skus: SKU[], key: keyof SKU): string[] {
  return [...new Set(skus.map((s) => s[key] as string).filter(Boolean))];
}

function isOptionAvailable(skus: SKU[], key: keyof SKU, value: string): boolean {
  return skus.some((s) => s[key] === value && s.available);
}

function DimButton({
  label,
  available,
  selected,
  onToggle,
}: {
  label: string;
  available: boolean;
  selected: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation("catalog");

  const handleClick = () => available && onToggle();

  return (
    <WrapItem>
      <Button
        size="sm"
        variant={selected ? "solid" : "outline"}
        colorPalette={selected ? "blue" : "gray"}
        disabled={!available}
        aria-pressed={selected}
        aria-disabled={!available}
        // Sold-out options are marked only by opacity and a strikethrough, neither of which
        // reaches a screen reader — the label is where availability gets said out loud.
        aria-label={available ? undefined : t("product.optionUnavailable", { option: label })}
        opacity={!available ? 0.3 : 1}
        textDecoration={!available ? "line-through" : "none"}
        onClick={handleClick}
      >
        {label}
      </Button>
    </WrapItem>
  );
}

function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const { t } = useTranslation("catalog");
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <Card h={{ base: "72", md: "96" }} display="flex" alignItems="center" justifyContent="center">
        <EmptyState title={t("product.noImage")} icon={<ImageOff size={28} strokeWidth={1.5} />} />
      </Card>
    );
  }

  return (
    <Box>
      <Card h={{ base: "72", md: "96" }} position="relative">
        <OptimizedImage
          src={images[selectedIndex]}
          width={HERO_IMAGE_WIDTH}
          eager
          alt={name}
          fallbackLabel={t("product.noImage")}
          h="full"
          w="full"
          objectFit="cover"
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="40%"
          pointerEvents="none"
          bgGradient="to-t"
          gradientFrom="blackAlpha.900"
          gradientTo="transparent"
        />
      </Card>

      {images.length > 1 && (
        <Wrap mt={3} gap={2}>
          {images.map((image, index) => {
            const selectThumbnail = () => setSelectedIndex(index);
            return (
              <WrapItem key={image}>
                <Button
                  p={0}
                  h="16"
                  w="16"
                  minW="16"
                  variant="outline"
                  borderRadius="md"
                  overflow="hidden"
                  borderColor={index === selectedIndex ? "blue.400" : "border.muted"}
                  borderWidth={index === selectedIndex ? "2px" : "1px"}
                  aria-pressed={index === selectedIndex}
                  aria-label={t("product.viewImage", { index: index + 1 })}
                  onClick={selectThumbnail}
                >
                  <OptimizedImage
                    src={image}
                    width={THUMB_IMAGE_WIDTH}
                    alt=""
                    h="full"
                    w="full"
                    objectFit="cover"
                  />
                </Button>
              </WrapItem>
            );
          })}
        </Wrap>
      )}
    </Box>
  );
}

function QuantityStepper({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  const { t } = useTranslation("catalog");

  const decrease = () => onChange(Math.max(1, value - 1));
  const increase = () => onChange(value + 1);

  return (
    <Flex
      align="center"
      w="fit-content"
      borderWidth="1px"
      borderColor="border.muted"
      borderRadius="md"
    >
      <Button
        variant="ghost"
        size="sm"
        aria-label={t("product.decreaseQuantity")}
        disabled={value <= 1}
        onClick={decrease}
      >
        −
      </Button>
      <Text
        minW="8"
        textAlign="center"
        fontWeight="700"
        aria-live="polite"
        data-testid="product-quantity-value"
      >
        {value}
      </Text>
      <Button
        variant="ghost"
        size="sm"
        aria-label={t("product.increaseQuantity")}
        onClick={increase}
      >
        +
      </Button>
    </Flex>
  );
}

export function ProductDetailView({
  product,
  isLoading,
  isError,
  onRetry,
  onAddToCart,
  breadcrumbItems = [],
  renderBreadcrumbLink,
}: ProductDetailViewProps) {
  const { t } = useTranslation("catalog");
  const formatPrice = useFormatPrice();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const skus = product?.skus ?? [];
  const sizes = useMemo(() => uniqueValues(skus, "size"), [skus]);
  const colors = useMemo(() => uniqueValues(skus, "color"), [skus]);
  const editions = useMemo(() => uniqueValues(skus, "edition"), [skus]);

  const images = useMemo(() => {
    if (!product) return [];
    if (product.images?.length) return product.images;
    return product.imageUrl ? [product.imageUrl] : [];
  }, [product]);

  const selectedSku = useMemo(() => {
    if (!skus.length) return null;
    return (
      skus.find(
        (s) =>
          (!sizes.length || s.size === selectedSize) &&
          (!colors.length || s.color === selectedColor) &&
          (!editions.length || s.edition === selectedEdition)
      ) ?? null
    );
  }, [skus, sizes, colors, editions, selectedSize, selectedColor, selectedEdition]);

  const displayPrice = selectedSku?.price ?? product?.price;

  if (isLoading) {
    return (
      <PageContainer size="md" py={{ base: 6, md: 10 }}>
        <Flex gap={8} direction={{ base: "column", md: "row" }}>
          <Box flex={{ base: "1", md: "0 0 52%" }}>
            <Skeleton h="96" borderRadius="xl" />
          </Box>
          <Box flex="1">
            <Skeleton h="10" w="3/4" mb={4} />
            <Skeleton h="4" w="full" mb={2} />
            <Skeleton h="4" w="2/3" mb={6} />
            <Skeleton h="8" w="28" mb={8} />
            <Skeleton h="12" w="full" />
          </Box>
        </Flex>
      </PageContainer>
    );
  }

  if (isError || !product) {
    return <QueryError message={t("errors.product")} onRetry={onRetry} />;
  }

  const canAddToCart = selectedSku?.available === true;
  const accent = product.accentColor ?? "#0094e0";

  const handleAddToCart = async () => {
    if (!selectedSku) return;
    setIsAdding(true);
    try {
      await onAddToCart?.(selectedSku, quantity);
      toaster.create({
        type: "success",
        title: t("product.addedToCart"),
        description: t("product.addedToCartDetail", { quantity, name: product.name }),
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <PageContainer size="md" py={{ base: 6, md: 10 }}>
      {breadcrumbItems.length > 0 && renderBreadcrumbLink && (
        <Box mb={6}>
          <Breadcrumb items={breadcrumbItems} renderLink={renderBreadcrumbLink} />
        </Box>
      )}

      <Flex gap={8} direction={{ base: "column", md: "row" }} align="flex-start">
        <Box flex={{ base: "1", md: "0 0 52%" }}>
          <ProductGallery images={images} name={product.name} />
        </Box>

        <Box flex="1" minW={0} pt={{ base: 0, md: 2 }}>
          <Box h="3px" w="40px" borderRadius="full" mb={4} style={{ background: accent }} />

          <Heading as="h1" textStyle="h1" color="fg" mb={2}>
            {product.name}
          </Heading>

          {product.description && (
            <Text color="fg.muted" mb={5} fontSize="sm" lineHeight="relaxed">
              {product.description}
            </Text>
          )}

          <Text
            data-testid="product-price"
            color="fg"
            fontSize="3xl"
            fontWeight="800"
            mb={6}
            letterSpacing="-0.03em"
          >
            {displayPrice === undefined ? null : formatPrice(displayPrice)}
          </Text>

          {sizes.length > 0 && (
            <Box mb={5}>
              <Text
                color="fg.muted"
                fontSize="xs"
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.1em"
                fontWeight="700"
              >
                {t("product.size")}
              </Text>
              <Wrap>
                {sizes.map((size) => (
                  <DimButton
                    key={size}
                    label={size}
                    available={isOptionAvailable(skus, "size", size)}
                    selected={selectedSize === size}
                    onToggle={() => setSelectedSize(selectedSize === size ? null : size)}
                  />
                ))}
              </Wrap>
            </Box>
          )}

          {colors.length > 0 && (
            <Box mb={5}>
              <Text
                color="fg.muted"
                fontSize="xs"
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.1em"
                fontWeight="700"
              >
                {t("product.color")}
              </Text>
              <Wrap>
                {colors.map((color) => (
                  <DimButton
                    key={color}
                    label={color}
                    available={isOptionAvailable(skus, "color", color)}
                    selected={selectedColor === color}
                    onToggle={() => setSelectedColor(selectedColor === color ? null : color)}
                  />
                ))}
              </Wrap>
            </Box>
          )}

          {editions.length > 0 && (
            <Box mb={5}>
              <Text
                color="fg.muted"
                fontSize="xs"
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.1em"
                fontWeight="700"
              >
                {t("product.edition")}
              </Text>
              <Wrap>
                {editions.map((edition) => (
                  <DimButton
                    key={edition}
                    label={edition}
                    available={isOptionAvailable(skus, "edition", edition)}
                    selected={selectedEdition === edition}
                    onToggle={() =>
                      setSelectedEdition(selectedEdition === edition ? null : edition)
                    }
                  />
                ))}
              </Wrap>
            </Box>
          )}

          <Box mb={5}>
            <Text
              color="fg.muted"
              fontSize="xs"
              mb={2}
              textTransform="uppercase"
              letterSpacing="0.1em"
              fontWeight="700"
            >
              {t("product.quantity")}
            </Text>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </Box>

          <Button
            size="lg"
            w="full"
            mt={6}
            colorPalette={canAddToCart ? "blue" : "gray"}
            disabled={!canAddToCart || isAdding}
            aria-disabled={!canAddToCart || isAdding}
            loading={isAdding}
            loadingText={t("product.addingToCart")}
            fontWeight="700"
            letterSpacing="0.02em"
            onClick={handleAddToCart}
          >
            {t("product.addToCart")}
          </Button>
        </Box>
      </Flex>
    </PageContainer>
  );
}
