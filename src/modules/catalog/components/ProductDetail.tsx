import type { JSX } from "react";

import { addToCart, formatVariant } from "@/store/cart";
import { ProductDetailView } from "./ProductDetailView";
import type { SKU } from "@/api/types";

import { useProduct } from "../hooks";

type Props = {
  productSlug: string;
};

export function ProductDetail({ productSlug }: Props): JSX.Element {
  const { data: product, isLoading, isError, refetch } = useProduct(productSlug);

  function handleAddToCart(sku: SKU): void {
    if (!product) return;
    addToCart({
      skuId: sku.id,
      productId: product.id,
      productName: product.name,
      variant: formatVariant(sku.size, sku.color, sku.edition),
      price: sku.price,
    });
  }

  return (
    <ProductDetailView
      product={product}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      onAddToCart={handleAddToCart}
    />
  );
}
