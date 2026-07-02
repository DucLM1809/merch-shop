import type { MetaDescriptor } from "@tanstack/react-router";

import type { Product } from "@/api/types";

const SITE_NAME = "Merch Shop";

type BreadcrumbItem = { name: string; url: string };

function breadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

type GameHeadParams = {
  gameName: string;
  gameSlug: string;
  publisherName?: string;
  publisherSlug: string;
};

export function buildGameHeadMeta(params: GameHeadParams): MetaDescriptor[] {
  const { gameName, gameSlug, publisherName, publisherSlug } = params;
  const title = publisherName
    ? `${gameName} Merch by ${publisherName} | ${SITE_NAME}`
    : `${gameName} Merch | ${SITE_NAME}`;
  const description = `Shop official ${gameName} merchandise${
    publisherName ? ` from ${publisherName}` : ""
  } — apparel, accessories, and collectibles.`;
  const gameUrl = `/${publisherSlug}/${gameSlug}`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    {
      "script:ld+json": breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: gameName, url: gameUrl },
      ]),
    },
  ];
}

export function buildProductHeadMeta(product: Product): MetaDescriptor[] {
  const title = `${product.name} | ${SITE_NAME}`;
  const description = product.description ?? `Shop ${product.name} at ${SITE_NAME}.`;
  const inStock = product.skus?.some((sku) => sku.available) ?? true;
  const productUrl = `/${product.publisherSlug}/${product.gameSlug}/products/${product.slug}`;

  const meta: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "product" },
  ];

  if (product.imageUrl) {
    meta.push({ property: "og:image", content: product.imageUrl });
  }

  meta.push({
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description,
      ...(product.imageUrl ? { image: product.imageUrl } : {}),
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "USD",
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    },
  });

  meta.push({
    "script:ld+json": breadcrumbJsonLd([
      { name: "Home", url: "/" },
      {
        name: slugToTitle(product.gameSlug),
        url: `/${product.publisherSlug}/${product.gameSlug}`,
      },
      { name: product.name, url: productUrl },
    ]),
  });

  return meta;
}
