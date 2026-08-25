import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations, renderWithProviders } from "@/test-utils";
import { Breadcrumb } from "./Breadcrumb";

const renderLink = (to: string, _params: Record<string, string> | undefined, label: string) => (
  <a href={to}>{label}</a>
);

describe("Breadcrumb", () => {
  it("renders every item's label", () => {
    renderWithProviders(
      <Breadcrumb
        items={[
          { label: "Riot Games", to: "/riot-games" },
          { label: "League of Legends", to: "/riot-games/lol" },
          { label: "Faker Jersey" },
        ]}
        renderLink={renderLink}
      />
    );
    expect(screen.getByText("Riot Games")).toBeInTheDocument();
    expect(screen.getByText("League of Legends")).toBeInTheDocument();
    expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
  });

  it("renders every non-final item as a link and the final item as plain text", () => {
    renderWithProviders(
      <Breadcrumb
        items={[{ label: "Riot Games", to: "/riot-games" }, { label: "Faker Jersey" }]}
        renderLink={renderLink}
      />
    );
    expect(screen.getByRole("link", { name: "Riot Games" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Faker Jersey" })).not.toBeInTheDocument();
  });

  it("calls renderLink with the item's to/params", () => {
    const spy = vi.fn(renderLink);
    renderWithProviders(
      <Breadcrumb
        items={[
          {
            label: "League of Legends",
            to: "/$publisherSlug/$gameSlug",
            params: { gameSlug: "lol" },
          },
          { label: "Faker Jersey" },
        ]}
        renderLink={spy}
      />
    );
    expect(spy).toHaveBeenCalledWith(
      "/$publisherSlug/$gameSlug",
      { gameSlug: "lol" },
      "League of Legends"
    );
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(
      <Breadcrumb
        items={[{ label: "Riot Games", to: "/riot-games" }, { label: "Faker Jersey" }]}
        renderLink={renderLink}
      />
    );
    await expectNoA11yViolations(container);
  });
});
