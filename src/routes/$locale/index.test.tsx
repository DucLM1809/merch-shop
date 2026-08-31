import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import enUSCatalog from "@/i18n/locales/en-US/catalog.json";
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

  it("renders the value proposition strip", async () => {
    renderRoute("/");

    await waitFor(() => {
      expect(screen.getByText(enUSCatalog.home.value.licensedTitle)).toBeInTheDocument();
    });
    expect(screen.getByText(enUSCatalog.home.value.shippingTitle)).toBeInTheDocument();
    expect(screen.getByText(enUSCatalog.home.value.checkoutTitle)).toBeInTheDocument();
  });

  it("features multiple real products in the featured drops rail", async () => {
    renderRoute("/");

    await waitFor(() => {
      expect(screen.getAllByText("Faker Jersey").length).toBeGreaterThan(0);
    });
    expect(screen.getByText("Jett Hoodie")).toBeInTheDocument();
    expect(screen.getByText("CS2 Team Jersey")).toBeInTheDocument();
  });

  it("renders the manifesto statement", async () => {
    renderRoute("/");

    await waitFor(() => {
      expect(screen.getByText(enUSCatalog.home.manifesto.body)).toBeInTheDocument();
    });
  });
});
