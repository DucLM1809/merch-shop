import { type ReactNode } from "react";
import { Box, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { PackageX } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Product } from "@/api/types";
import { EmptyState } from "@/components/EmptyState";
import { QueryError } from "@/components/QueryError";
import { ProductCard } from "./ProductCard";

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
