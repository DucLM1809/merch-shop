import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import catalogCopy from "@/i18n/locales/en-US/catalog.json";
import { renderWithProviders } from "@/test-utils";
import { PublisherPageView } from "./PublisherPageView";
import { mockPublishers as publishers } from "@/mocks/handlers";

const gameCount = (count: number, form: "one" | "other") =>
  catalogCopy.publisher[`gameCount_${form}`].replace("{{count}}", String(count));

describe("PublisherPageView", () => {
  it("shows skeletons and no heading when loading", () => {
    renderWithProviders(
      <PublisherPageView publisher={undefined} isLoading={true} isError={false} />
    );
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("shows publisher name when loaded", () => {
    renderWithProviders(
      <PublisherPageView publisher={publishers[0]} isLoading={false} isError={false} />
    );
    expect(screen.getByRole("heading", { name: "Riot Games" })).toBeInTheDocument();
  });

  it("shows game count when loaded", () => {
    renderWithProviders(
      <PublisherPageView publisher={publishers[0]} isLoading={false} isError={false} />
    );
    expect(screen.getByText(gameCount(publishers[0].games.length, "other"))).toBeInTheDocument();
  });

  it("uses the singular form for a publisher with one game", () => {
    const oneGame = { ...publishers[0], games: publishers[0].games.slice(0, 1) };

    renderWithProviders(
      <PublisherPageView publisher={oneGame} isLoading={false} isError={false} />
    );

    expect(screen.getByText(gameCount(1, "one"))).toBeInTheDocument();
  });

  it("shows the translated error message when isError", () => {
    renderWithProviders(
      <PublisherPageView publisher={undefined} isLoading={false} isError={true} />
    );
    expect(screen.getByText(catalogCopy.errors.publisher)).toBeInTheDocument();
  });
});
