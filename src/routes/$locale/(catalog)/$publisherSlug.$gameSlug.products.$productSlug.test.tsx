import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import catalogCopy from "@/i18n/locales/en-US/catalog.json";
import { renderRoute } from "../../../test-utils";

/** The accessible name a sold-out variant carries — the copy, not a literal repeated here. */
const unavailable = (option: string) =>
  catalogCopy.product.optionUnavailable.replace("{{option}}", option);

// The real backend doesn't return a distinct product slug — /products/:id
// expects the DB id, so the route param is the fixture product's id ("1").
const PRODUCT_ROUTE = "/riot/league-of-legends/products/1";

describe("Product detail page", () => {
  it("renders product name and description", async () => {
    renderRoute(PRODUCT_ROUTE);
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /faker jersey/i })).toBeInTheDocument();
      expect(screen.getByText(/official t1 faker jersey/i)).toBeInTheDocument();
    });
  });

  it("shows all variant dimensions", async () => {
    renderRoute(PRODUCT_ROUTE);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "S" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "M" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: unavailable("L") })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Black" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "White" })).toBeInTheDocument();
    });
  });

  it("unavailable size L is disabled and says so in its accessible name", async () => {
    renderRoute(PRODUCT_ROUTE);
    const lBtn = await screen.findByRole("button", { name: unavailable("L") });
    expect(lBtn).toBeDisabled();
  });

  it("selecting a size marks it as pressed", async () => {
    const user = userEvent.setup();
    renderRoute(PRODUCT_ROUTE);
    const sBtn = await screen.findByRole("button", { name: "S" });
    await user.click(sBtn);
    expect(sBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("price updates when a full SKU is selected", async () => {
    const user = userEvent.setup();
    renderRoute(PRODUCT_ROUTE);
    // Default price shown before selection
    await screen.findByRole("button", { name: "S" });

    await user.click(screen.getByRole("button", { name: "S" }));
    await user.click(screen.getByRole("button", { name: "White" }));

    // S + White = $62.99
    await waitFor(() => {
      expect(screen.getByTestId("product-price")).toHaveTextContent("$62.99");
    });
  });

  it("Add to Cart is disabled with no SKU selected", async () => {
    renderRoute(PRODUCT_ROUTE);
    const addBtn = await screen.findByRole("button", { name: /add to cart/i });
    expect(addBtn).toBeDisabled();
  });

  it("Add to Cart is enabled when an available SKU is fully selected", async () => {
    const user = userEvent.setup();
    renderRoute(PRODUCT_ROUTE);
    await screen.findByRole("button", { name: "S" });

    await user.click(screen.getByRole("button", { name: "S" }));
    await user.click(screen.getByRole("button", { name: "Black" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add to cart/i })).not.toBeDisabled();
    });
  });

  it("Add to Cart stays disabled when unavailable SKU is selected", async () => {
    const user = userEvent.setup();
    renderRoute(PRODUCT_ROUTE);
    await screen.findByRole("button", { name: "M" });

    await user.click(screen.getByRole("button", { name: "M" }));
    await user.click(screen.getByRole("button", { name: "White" }));

    // M + White = unavailable
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add to cart/i })).toBeDisabled();
    });
  });

  it("sets dynamic title, meta description, and OG tags for the product", async () => {
    renderRoute(PRODUCT_ROUTE);
    await waitFor(() => {
      expect(document.title).toBe("Faker Jersey | Merch Shop");
    });
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Official T1 Faker jersey — lightweight performance fabric."
    );
    expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Faker Jersey | Merch Shop"
    );
    expect(document.head.querySelector('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "product"
    );
    expect(document.head.querySelector('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://picsum.photos/seed/faker-jersey/400/400"
    );
  });

  it("emits Product JSON-LD with name, price, and availability", async () => {
    renderRoute(PRODUCT_ROUTE);
    await waitFor(() => {
      expect(document.head.querySelectorAll('script[type="application/ld+json"]').length).toBe(2);
    });
    const scripts = [...document.head.querySelectorAll('script[type="application/ld+json"]')];
    const jsonLd = scripts.map((s) => JSON.parse(s.textContent ?? "{}"));
    const product = jsonLd.find((entry) => entry["@type"] === "Product");
    expect(product).toMatchObject({
      "@type": "Product",
      name: "Faker Jersey",
      offers: {
        "@type": "Offer",
        price: 59.99,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    });
  });

  it("renders a navigable Publisher → Game → Product breadcrumb", async () => {
    renderRoute(PRODUCT_ROUTE);

    expect(await screen.findByRole("link", { name: "Riot Games" })).toHaveAttribute(
      "href",
      "/en-US/riot"
    );
    expect(await screen.findByRole("link", { name: "League of Legends" })).toHaveAttribute(
      "href",
      "/en-US/riot/league-of-legends"
    );
    expect(screen.queryByRole("link", { name: /faker jersey/i })).not.toBeInTheDocument();
  });

  it("emits a BreadcrumbList JSON-LD ending with the product name", async () => {
    renderRoute(PRODUCT_ROUTE);
    await waitFor(() => {
      expect(document.head.querySelectorAll('script[type="application/ld+json"]').length).toBe(2);
    });
    const scripts = [...document.head.querySelectorAll('script[type="application/ld+json"]')];
    const jsonLd = scripts.map((s) => JSON.parse(s.textContent ?? "{}"));
    const breadcrumb = jsonLd.find((entry) => entry["@type"] === "BreadcrumbList");
    expect(breadcrumb.itemListElement.at(-1)).toMatchObject({
      "@type": "ListItem",
      name: "Faker Jersey",
    });
  });
});
