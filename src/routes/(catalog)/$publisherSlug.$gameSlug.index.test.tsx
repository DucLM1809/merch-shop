import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { renderRoute } from "../../test-utils";

const GAME_ROUTE = "/riot/league-of-legends";

describe("Game catalog page", () => {
  it("renders the game name", async () => {
    renderRoute(GAME_ROUTE);
    await waitFor(() => {
      expect(screen.getByText(/league of legends/i)).toBeInTheDocument();
    });
  });

  it("sets dynamic title, meta description, and OG tags for the game", async () => {
    renderRoute(GAME_ROUTE);
    await waitFor(() => {
      expect(document.title).toBe("League of Legends Merch by Riot Games | Merch Shop");
    });
    expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "League of Legends Merch by Riot Games | Merch Shop"
    );
    expect(document.head.querySelector('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website"
    );
    expect(document.head.querySelector('meta[name="description"]')).toBeInTheDocument();
  });

  it("emits a BreadcrumbList JSON-LD ending with the game name", async () => {
    renderRoute(GAME_ROUTE);
    let breadcrumb: { itemListElement: Array<Record<string, unknown>> } | undefined;
    await waitFor(() => {
      const script = document.head.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      breadcrumb = JSON.parse(script?.textContent ?? "{}");
    });
    expect(breadcrumb).toMatchObject({ "@type": "BreadcrumbList" });
    expect(breadcrumb?.itemListElement.at(-1)).toMatchObject({
      "@type": "ListItem",
      name: "League of Legends",
    });
  });
});
