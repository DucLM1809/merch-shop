import { screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";

import enUSCatalog from "@/i18n/locales/en-US/catalog.json";
import { BASE_URL } from "../../api/client";
import { envelope } from "../../mocks/handlers";
import { server } from "../../mocks/server";
import { renderRoute } from "../../test-utils";

describe("Landing page", () => {
  it("renders the hero headline, subtitle, and primary CTA", async () => {
    renderRoute("/");

    expect(
      await screen.findByRole("heading", { level: 1, name: enUSCatalog.home.hero.headline })
    ).toBeInTheDocument();

    expect(screen.getByText(enUSCatalog.home.hero.subtitle)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: enUSCatalog.home.hero.primaryCta })).toHaveAttribute(
      "href",
      "/en-US/shop"
    );
  });

  it("spotlights a real product in the hero, linking to its product page", async () => {
    renderRoute("/");

    expect(
      await screen.findByRole("link", { name: new RegExp(enUSCatalog.home.hero.spotlightCta) })
    ).toHaveAttribute("href", "/en-US/riot/league-of-legends/products/1");
  });

  it("links the secondary hero CTA to the shop-by-game section", async () => {
    renderRoute("/");

    expect(
      await screen.findByRole("link", { name: enUSCatalog.home.hero.secondaryCta })
    ).toHaveAttribute("href", "#shop-by-game");
  });

  it("shop-by-game tiles link to the shop filtered by that game", async () => {
    renderRoute("/");

    expect(await screen.findByRole("link", { name: "League of Legends" })).toHaveAttribute(
      "href",
      "/en-US/shop?game=lol"
    );
    expect(screen.getByRole("link", { name: "Valorant" })).toHaveAttribute(
      "href",
      "/en-US/shop?game=val"
    );
    expect(screen.getByRole("link", { name: "CS2" })).toHaveAttribute(
      "href",
      "/en-US/shop?game=cs2"
    );
  });

  it("paints a shop-by-game tile with the game's own imageUrl from the API", async () => {
    renderRoute("/");

    const tile = await screen.findByRole("link", { name: "League of Legends" });

    expect(tile.querySelector("img")).toHaveAttribute(
      "src",
      "https://images.unsplash.com/photo-lol-cover?w=480&q=75"
    );
  });

  it("renders a shop-by-game tile with no image when the game has no imageUrl", async () => {
    renderRoute("/");

    const tile = await screen.findByRole("link", { name: "CS2" });

    expect(tile.querySelector("img")).toBeNull();
  });

  it("renders the value proposition strip", async () => {
    renderRoute("/");

    await waitFor(() => {
      expect(screen.getByText(enUSCatalog.home.value.licensedTitle)).toBeInTheDocument();
    });
    expect(screen.getByText(enUSCatalog.home.value.shippingTitle)).toBeInTheDocument();
    expect(screen.getByText(enUSCatalog.home.value.checkoutTitle)).toBeInTheDocument();
  });

  // The grid needs games as well as products, since it groups under a heading per title —
  // so waiting on a product name the hero also renders would pass before the grid exists.
  it("lists the whole catalog, grouped under a heading per game", async () => {
    renderRoute("/");

    const grid = await screen.findByTestId("catalog-grid");

    expect(within(grid).getByRole("heading", { name: "League of Legends" })).toBeInTheDocument();
    expect(within(grid).getByRole("heading", { name: "Valorant" })).toBeInTheDocument();
    expect(within(grid).getByRole("heading", { name: "CS2" })).toBeInTheDocument();

    for (const name of [
      "Faker Jersey",
      "League of Legends Hoodie",
      "Cloud9 Jersey",
      "Valorant Team Jersey",
      "Jett Hoodie",
      "CS2 Team Jersey",
    ]) {
      expect(within(grid).getByText(name)).toBeInTheDocument();
    }
  });

  // The landing page is a way into the catalog, not the catalog itself — against a real
  // backend an uncapped grid would put every product a title has above the fold.
  it("caps each game group at two rows, however many products that game has", async () => {
    // GET /products nests the game ref and returns `images`/`skus` — the flat record shape
    // is the mock's internal one, and client.ts would normalize it into empty slugs.
    const overstocked = Array.from({ length: 11 }, (_, i) => ({
      id: `bulk-${i}`,
      name: `Bulk LoL Item ${i}`,
      images: ["https://picsum.photos/seed/bulk/400/400"],
      game: { id: "lol", name: "League of Legends", slug: "league-of-legends" },
      skus: [{ id: `bulk-sku-${i}`, price: 10 + i, available: true, attributes: {} }],
    }));
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json(envelope(overstocked))));

    renderRoute("/");

    const grid = await screen.findByTestId("catalog-grid");

    await waitFor(() => {
      expect(within(grid).getByText("Bulk LoL Item 0")).toBeInTheDocument();
    });
    expect(within(grid).getAllByRole("article")).toHaveLength(6);
    expect(within(grid).queryByText("Bulk LoL Item 6")).not.toBeInTheDocument();
  });

  it("links a product in the grid to its product page", async () => {
    renderRoute("/");

    const grid = await screen.findByTestId("catalog-grid");

    expect(within(grid).getByRole("link", { name: "Jett Hoodie" })).toHaveAttribute(
      "href",
      "/en-US/riot/valorant/products/6"
    );
  });

  it("renders the manifesto statement", async () => {
    renderRoute("/");

    await waitFor(() => {
      expect(screen.getByText(enUSCatalog.home.manifesto.body)).toBeInTheDocument();
    });
  });
});
