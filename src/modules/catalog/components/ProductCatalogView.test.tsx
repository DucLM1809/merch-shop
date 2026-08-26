import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import catalogCopy from "@/i18n/locales/en-US/catalog.json";
import { expectNoA11yViolations, priceText, renderWithProviders } from "@/test-utils";
import { ProductCatalogView } from "./ProductCatalogView";
import type { Product } from "@/api/types";

const products: Product[] = [
  {
    id: "1",
    slug: "faker-jersey",
    name: "Faker Jersey",
    price: 59.99,
    publisherId: "riot",
    publisherSlug: "riot",
    gameId: "lol",
    gameSlug: "league-of-legends",
    imageUrl: "https://picsum.photos/seed/faker-jersey/400/400",
  },
  {
    id: "2",
    slug: "lol-hoodie",
    name: "League of Legends Hoodie",
    price: 79.99,
    publisherId: "riot",
    publisherSlug: "riot",
    gameId: "lol",
    gameSlug: "league-of-legends",
  },
];

describe("ProductCatalogView", () => {
  it("hides product names when loading", () => {
    renderWithProviders(
      <ProductCatalogView products={undefined} isLoading={true} isError={false} />
    );
    expect(screen.queryByText("Faker Jersey")).not.toBeInTheDocument();
  });

  it("shows error message when isError", () => {
    renderWithProviders(
      <ProductCatalogView products={undefined} isLoading={false} isError={true} />
    );
    expect(screen.getByText(catalogCopy.errors.products)).toBeInTheDocument();
  });

  it("shows empty message when products array is empty", () => {
    renderWithProviders(<ProductCatalogView products={[]} isLoading={false} isError={false} />);
    expect(screen.getByText(catalogCopy.empty.title)).toBeInTheDocument();
    expect(screen.getByText(catalogCopy.empty.hint)).toBeInTheDocument();
  });

  it("renders all product names", () => {
    renderWithProviders(
      <ProductCatalogView products={products} isLoading={false} isError={false} />
    );
    expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
    expect(screen.getByText("League of Legends Hoodie")).toBeInTheDocument();
  });

  it("renders prices formatted for the rendering locale", () => {
    renderWithProviders(
      <ProductCatalogView products={products} isLoading={false} isError={false} />
    );
    expect(screen.getByText(priceText(59.99, "en-US"))).toBeInTheDocument();
    expect(screen.getByText(priceText(79.99, "en-US"))).toBeInTheDocument();
  });

  it("uses renderLink when provided", () => {
    renderWithProviders(
      <ProductCatalogView
        products={products}
        isLoading={false}
        isError={false}
        renderLink={(product, children) => <a href={`/products/${product.slug}`}>{children}</a>}
      />
    );
    expect(screen.getByRole("link", { name: "Faker Jersey" })).toHaveAttribute(
      "href",
      "/products/faker-jersey"
    );
  });

  it("renders the no-image fallback when product has no imageUrl", () => {
    const noImageProduct: Product[] = [
      {
        id: "2",
        slug: "lol-hoodie",
        name: "League of Legends Hoodie",
        price: 79.99,
        publisherId: "riot",
        publisherSlug: "riot",
        gameId: "lol",
        gameSlug: "league-of-legends",
      },
    ];
    renderWithProviders(
      <ProductCatalogView products={noImageProduct} isLoading={false} isError={false} />
    );
    expect(screen.getByText(catalogCopy.product.noImage)).toBeInTheDocument();
  });

  it("shows an accent indicator dot when the product has an accentColor", () => {
    const accentProduct: Product[] = [
      {
        id: "3",
        slug: "accent-product",
        name: "Accent Product",
        price: 29.99,
        publisherId: "pub",
        publisherSlug: "pub",
        gameId: "game",
        gameSlug: "game",
        accentColor: "#ff0000",
      },
    ];
    renderWithProviders(
      <ProductCatalogView products={accentProduct} isLoading={false} isError={false} />
    );
    expect(screen.getByTestId("product-accent-dot")).toHaveStyle({ background: "#ff0000" });
  });

  it("renders no accent indicator when accentColor is absent, and the card still looks designed", () => {
    const noAccentProduct: Product[] = [
      {
        id: "4",
        slug: "no-accent",
        name: "No Accent Product",
        price: 19.99,
        publisherId: "pub",
        publisherSlug: "pub",
        gameId: "game",
        gameSlug: "game",
      },
    ];
    renderWithProviders(
      <ProductCatalogView products={noAccentProduct} isLoading={false} isError={false} />
    );
    expect(screen.queryByTestId("product-accent-dot")).not.toBeInTheDocument();
    const card = screen.getByText("No Accent Product").closest("article");
    expect(card).toHaveStyle({ boxShadow: expect.stringContaining("rgba") as string });
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(
      <ProductCatalogView
        products={products}
        isLoading={false}
        isError={false}
        renderLink={(product, children) => <a href={`/products/${product.slug}`}>{children}</a>}
      />
    );
    await expectNoA11yViolations(container);
  });

  it("renders plain article cards without links when renderLink is absent", () => {
    const { container } = renderWithProviders(
      <ProductCatalogView products={products} isLoading={false} isError={false} />
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(container.querySelectorAll("article")).toHaveLength(products.length);
  });
});
