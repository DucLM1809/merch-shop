import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test-utils";

import { PublisherPage } from "./PublisherPage";

describe("PublisherPage", () => {
  it("shows no heading while loading", () => {
    renderWithProviders(<PublisherPage publisherSlug="riot" />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("shows publisher name when loaded", async () => {
    renderWithProviders(<PublisherPage publisherSlug="riot" />);
    expect(await screen.findByRole("heading", { name: "Riot Games" })).toBeInTheDocument();
  });

  it("leaves --accent unset since the backend doesn't return a publisher accent color", async () => {
    renderWithProviders(<PublisherPage publisherSlug="riot" />);
    const heading = await screen.findByRole("heading", { name: "Riot Games" });
    let el: Element | null = heading;
    while (el) {
      expect((el as HTMLElement).style?.getPropertyValue("--accent")).toBe("");
      el = el.parentElement;
    }
  });
});
