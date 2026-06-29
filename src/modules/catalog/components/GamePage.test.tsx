import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test-utils";

import { GamePage } from "./GamePage";

describe("GamePage", () => {
  it("shows no heading while publisher data is loading", () => {
    renderWithProviders(<GamePage publisherSlug="riot" gameSlug="league-of-legends" />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("shows game name heading when data loads and game is found", async () => {
    renderWithProviders(<GamePage publisherSlug="riot" gameSlug="league-of-legends" />);
    expect(await screen.findByRole("heading", { name: "League of Legends" })).toBeInTheDocument();
  });

  it("falls back to raw gameSlug as heading when game not found in publisher", async () => {
    renderWithProviders(<GamePage publisherSlug="riot" gameSlug="nonexistent-game" />);
    expect(await screen.findByRole("heading", { name: "nonexistent-game" })).toBeInTheDocument();
  });
});
