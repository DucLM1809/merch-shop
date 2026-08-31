import { type ReactNode } from "react";
import { Box, Flex, Heading, LinkOverlay, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import { ImageOff, PackageX } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Product } from "@/api/types";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { OptimizedImage } from "@/components/OptimizedImage";
import { QueryError } from "@/components/QueryError";
import { useFormatPrice } from "@/i18n/useFormatPrice";

const CARD_IMAGE_WIDTH = 480;

export interface ProductCatalogViewProps {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  renderLink?: (product: Product, children: ReactNode) => ReactNode;
}

export function ProductCatalogView({
  products,
  isLoading,
  isError,
  onRetry,
  renderLink,
}: ProductCatalogViewProps) {
  const { t } = useTranslation("catalog");

  if (isLoading) {
    return (
      <Box p={8}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={5}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} h="72" borderRadius="lg" />
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (isError) {
    return <QueryError message={t("errors.products")} onRetry={onRetry} />;
  }

  if (!products?.length) {
    return (
      <Box p={8} py={20}>
        <EmptyState
          title={t("empty.title")}
          description={t("empty.hint")}
          icon={<PackageX size={32} strokeWidth={1.5} />}
        />
      </Box>
    );
  }

  return (
    <Box p={8}>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={5}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} renderLink={renderLink} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

type ProductCardProps = {
  product: Product;
  renderLink?: (product: Product, children: ReactNode) => ReactNode;
};

function ProductCard({ product, renderLink }: ProductCardProps) {
  const { t } = useTranslation("catalog");
  const formatPrice = useFormatPrice();
  const price = formatPrice(product.price);

  const imageSection = (
    <Box h="52" bg="bg.muted" overflow="hidden" position="relative">
      {product.imageUrl ? (
        <>
          <OptimizedImage
            src={product.imageUrl}
            width={CARD_IMAGE_WIDTH}
            alt={product.name}
            fallbackLabel={t("product.noImage")}
            h="full"
            w="full"
            objectFit="cover"
            transition="transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            _groupHover={{ transform: "scale(1.06)" }}
          />
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            h="45%"
            pointerEvents="none"
            bgGradient="to-t"
            gradientFrom="blackAlpha.900"
            gradientTo="transparent"
          />
        </>
      ) : (
        <Flex h="full" align="center" justify="center">
          <EmptyState
            title={t("product.noImage")}
            icon={<ImageOff size={22} strokeWidth={1.5} />}
          />
        </Flex>
      )}
      {product.accentColor && (
        <Box
          position="absolute"
          top={3}
          right={3}
          w="10px"
          h="10px"
          borderRadius="full"
          borderWidth="2px"
          borderColor="bg.panel"
          // `accentColor` is an API-supplied per-Product value, not yet a design token —
          // this is the one exception ADR 0008 allows for dynamic runtime colors.
          style={{ background: product.accentColor }}
          aria-hidden="true"
          data-testid="product-accent-dot"
        />
      )}
    </Box>
  );

  const priceText = (
    <Text color="fg.muted" fontWeight="700" fontSize="sm">
      {price}
    </Text>
  );

  if (renderLink) {
    return (
      <Card as="article" interactive clipCorner className="group">
        {imageSection}
        <Box p={4} pt={3}>
          <LinkOverlay asChild>
            {renderLink(
              product,
              <Heading textStyle="h3" color="fg" mb={1.5}>
                {product.name}
              </Heading>
            )}
          </LinkOverlay>
          {priceText}
        </Box>
      </Card>
    );
  }

  return (
    <Card as="article" clipCorner className="group">
      {imageSection}
      <Box p={4} pt={3}>
        <Heading textStyle="h3" color="fg" mb={1.5}>
          {product.name}
        </Heading>
        {priceText}
      </Box>
    </Card>
  );
}
