import { screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import enUSCatalog from "@/i18n/locales/en-US/catalog.json";
import enGBCatalog from "@/i18n/locales/en-GB/catalog.json";
import frFRCatalog from "@/i18n/locales/fr-FR/catalog.json";
import { priceText, renderRoute } from "@/test-utils";

// Phase 1 draws a line through the catalog: the chrome around a product is translated, the
// product itself is not. These tests hold both halves of that line at once — the French page
// says "Tous les produits" over a product still called "Faker Jersey" — so a later change
// that starts translating fixture content, or stops translating chrome, fails here.

const FAKER_JERSEY_PRICE = 59.99;
const PRODUCT_ROUTE = "/riot/league-of-legends/products/1";

describe("Catalog chrome across locales", () => {
  it("renders the shop chrome in French under the fr-FR prefix", async () => {
    renderRoute("/fr-FR/shop");

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: frFRCatalog.shop.title })).toBeInTheDocument();
    });

    expect(screen.getByText(frFRCatalog.shop.subtitle)).toBeInTheDocument();
    expect(screen.queryByText(enUSCatalog.shop.subtitle)).not.toBeInTheDocument();
  });

  it("translates the facet filter group labels", async () => {
    renderRoute("/fr-FR/shop");

    await waitFor(() => {
      expect(screen.getByText(frFRCatalog.filters.game)).toBeInTheDocument();
    });

    expect(screen.getByText(frFRCatalog.filters.team)).toBeInTheDocument();
    expect(screen.getByText(frFRCatalog.filters.character)).toBeInTheDocument();
  });

  it("leaves product, team, and character names untranslated", async () => {
    renderRoute("/fr-FR/shop");

    await waitFor(() => {
      expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
    });

    expect(await screen.findByRole("checkbox", { name: "T1" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "League of Legends" })).toBeInTheDocument();
  });

  it("uses en-GB's own spelling of the catalog chrome", async () => {
    renderRoute("/en-GB/shop");

    await waitFor(() => {
      expect(screen.getByText(enGBCatalog.shop.subtitle)).toBeInTheDocument();
    });

    // The one word that differs between the two English locales.
    expect(enGBCatalog.shop.subtitle).not.toBe(enUSCatalog.shop.subtitle);
  });
});

describe("Catalog prices across locales", () => {
  it("formats the product price for the locale in the URL", async () => {
    renderRoute(`/fr-FR${PRODUCT_ROUTE}`);

    const price = await screen.findByTestId("product-price");

    expect(priceText(FAKER_JERSEY_PRICE, "fr-FR")(price.textContent ?? "")).toBe(true);
  });

  it("formats the same amount differently per locale, without converting it", async () => {
    const { unmount } = renderRoute(`/en-US${PRODUCT_ROUTE}`);

    const usPrice = await screen.findByTestId("product-price");

    expect(priceText(FAKER_JERSEY_PRICE, "en-US")(usPrice.textContent ?? "")).toBe(true);

    unmount();

    renderRoute(`/fr-FR${PRODUCT_ROUTE}`);

    const frenchPrice = await screen.findByTestId("product-price");

    // Same 59.99 either way — French just writes the decimal with a comma.
    expect(frenchPrice).toHaveTextContent("59,99");
    expect(frenchPrice).not.toHaveTextContent("59.99");
  });

  it("translates the Add to Cart button alongside the price", async () => {
    renderRoute(`/fr-FR${PRODUCT_ROUTE}`);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: frFRCatalog.product.addToCart })
      ).toBeInTheDocument();
    });
  });

  it("names a sold-out variant as unavailable in the active locale", async () => {
    renderRoute(`/fr-FR${PRODUCT_ROUTE}`);

    const expected = frFRCatalog.product.optionUnavailable.replace("{{option}}", "L");

    expect(await screen.findByRole("button", { name: expected })).toBeDisabled();
  });

  it("formats catalog grid prices for the active locale", async () => {
    renderRoute("/fr-FR/shop");

    await waitFor(() => {
      expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
    });

    const card = screen.getByText("Faker Jersey").closest("article");

    expect(card).not.toBeNull();
    expect(
      within(card as HTMLElement).getByText(priceText(FAKER_JERSEY_PRICE, "fr-FR"))
    ).toBeInTheDocument();
  });
});
