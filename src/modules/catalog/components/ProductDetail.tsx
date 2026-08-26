import type { JSX, ReactNode } from "react";

import { Link, type CreateLinkProps } from "@tanstack/react-router";

import type { BreadcrumbItem } from "@/components/Breadcrumb";
import { useLocale } from "@/i18n/useLocale";
import { addToCart, formatVariant } from "@/store/cart";
import { ProductDetailView } from "./ProductDetailView";
import type { SKU } from "@/api/types";

import { useProduct, usePublisher } from "../hooks";

type Props = {
  productSlug: string;
};

export function ProductDetail({ productSlug }: Props): JSX.Element {
  const { data: product, isLoading, isError, refetch } = useProduct(productSlug);
  const { data: publisher } = usePublisher(product?.publisherSlug ?? "", !!product);
  const locale = useLocale();

  const game = publisher?.games.find((g) => g.slug === product?.gameSlug);

  const breadcrumbItems: BreadcrumbItem[] = product
    ? [
        {
          label: publisher?.name ?? product.publisherSlug,
          to: "/$locale/$publisherSlug",
          params: { publisherSlug: product.publisherSlug },
        },
        {
          label: game?.name ?? product.gameSlug,
          to: "/$locale/$publisherSlug/$gameSlug",
          params: { publisherSlug: product.publisherSlug, gameSlug: product.gameSlug },
        },
        { label: product.name },
      ]
    : [];

  function renderBreadcrumbLink(
    to: string,
    params: Record<string, string> | undefined,
    label: string
  ): ReactNode {
    // Breadcrumb stays route-agnostic (its `to` is a plain string, see Breadcrumb.tsx),
    // but this container knows the concrete, typed routes — same escape hatch as
    // PublisherNav's `sharedNavProps` cast.
    const linkProps = { to, params: { locale, ...params } } as Pick<
      CreateLinkProps,
      "to" | "params"
    >;
    return <Link {...linkProps}>{label}</Link>;
  }

  function handleAddToCart(sku: SKU, quantity: number): void {
    if (!product) return;
    addToCart(
      {
        skuId: sku.id,
        productId: product.id,
        productName: product.name,
        variant: formatVariant(sku.size, sku.color, sku.edition),
        price: sku.price,
      },
      quantity
    );
  }

  return (
    <ProductDetailView
      product={product}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      onAddToCart={handleAddToCart}
      breadcrumbItems={breadcrumbItems}
      renderBreadcrumbLink={renderBreadcrumbLink}
    />
  );
}
