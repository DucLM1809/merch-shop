import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/test-utils";
import { GamePageView } from "./GamePageView";

describe("GamePageView", () => {
  it("shows a skeleton when loading", () => {
    renderWithProviders(
      <GamePageView
        gameName={undefined}
        publisherName={undefined}
        accentColor={undefined}
        isLoading={true}
        isError={false}
      />
    );
    // Skeleton replaces heading — no heading text should appear
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders game name heading when loaded", () => {
    renderWithProviders(
      <GamePageView
        gameName="League of Legends"
        publisherName="Riot Games"
        accentColor="#d13639"
        isLoading={false}
        isError={false}
      />
    );
    expect(screen.getByRole("heading", { name: "League of Legends" })).toBeInTheDocument();
  });

  it("renders publisher name subtitle when loaded", () => {
    renderWithProviders(
      <GamePageView
        gameName="League of Legends"
        publisherName="Riot Games"
        accentColor="#d13639"
        isLoading={false}
        isError={false}
      />
    );
    expect(screen.getByText("Riot Games")).toBeInTheDocument();
  });
});
