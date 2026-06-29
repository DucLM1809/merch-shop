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

  it("sets --accent CSS var on wrapper when publisher loads", async () => {
    renderWithProviders(<PublisherPage publisherSlug="riot" />);
    const heading = await screen.findByRole("heading", { name: "Riot Games" });
    let el: Element | null = heading;
    while (el && !(el as HTMLElement).style?.getPropertyValue("--accent")) {
      el = el.parentElement;
    }
    expect((el as HTMLElement | null)?.style.getPropertyValue("--accent")).toBe("#d13639");
  });
});
