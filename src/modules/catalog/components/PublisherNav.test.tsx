import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { DEFAULT_LOCALE } from "@/i18n/locales";
import { renderWithProviders } from "@/test-utils";

import { PublisherNav } from "./PublisherNav";

describe("PublisherNav", () => {
  it("renders all publishers with their games", async () => {
    renderWithProviders(<PublisherNav />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Riot Games" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Valve" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "League of Legends" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "CS2" })).toBeInTheDocument();
    });
  });

  it("marks the active publisher with aria-current", async () => {
    renderWithProviders(<PublisherNav activePublisherSlug="riot" />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Riot Games" })).toHaveAttribute(
        "aria-current",
        "page"
      );
      expect(screen.getByRole("link", { name: "Valve" })).not.toHaveAttribute("aria-current");
    });
  });

  it("marks the active game with aria-current", async () => {
    renderWithProviders(
      <PublisherNav activePublisherSlug="riot" activeGameSlug="league-of-legends" />
    );
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "League of Legends" })).toHaveAttribute(
        "aria-current",
        "page"
      );
      expect(screen.getByRole("link", { name: "Valorant" })).not.toHaveAttribute("aria-current");
    });
  });

  // The route ids these links carry are cast past TanStack Router's typed generics on
  // the way to Link, so the compiler can't catch a missing locale segment here — an
  // unprefixed href still navigates, via the redirect that resolves a bare URL, but it
  // drops the browsing locale and re-resolves it from the cookie. Assert the built href,
  // not just that a link exists.
  it("points at the locale-prefixed catalog routes", async () => {
    renderWithProviders(<PublisherNav />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Riot Games" })).toHaveAttribute(
        "href",
        `/${DEFAULT_LOCALE}/riot`
      );
      expect(screen.getByRole("link", { name: "League of Legends" })).toHaveAttribute(
        "href",
        `/${DEFAULT_LOCALE}/riot/league-of-legends`
      );
    });
  });
});
