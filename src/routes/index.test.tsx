import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { renderWithProviders, renderRoute } from "../test-utils";

import { ProductCatalog } from "@/modules/catalog";

describe("Product catalog", () => {
  it("renders a product card for each product", async () => {
    renderWithProviders(<ProductCatalog />);
    await waitFor(() => {
      expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
      expect(screen.getByText("League of Legends Hoodie")).toBeInTheDocument();
    });
  });

  it("filters to a single publisher", async () => {
    renderWithProviders(<ProductCatalog filters={{ publisher: "riot" }} />);
    await waitFor(() => {
      expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
      expect(screen.queryByText("CS2 Team Jersey")).not.toBeInTheDocument();
    });
  });

  it("filters to a single game by slug", async () => {
    renderWithProviders(<ProductCatalog filters={{ gameSlug: "league-of-legends" }} />);
    await waitFor(() => {
      expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
      expect(screen.queryByText("Valorant Team Jersey")).not.toBeInTheDocument();
      expect(screen.queryByText("CS2 Team Jersey")).not.toBeInTheDocument();
    });
  });
});

describe("Facet filtering", () => {
  it("clicking a Team filter narrows the product grid to that team", async () => {
    const user = userEvent.setup();
    renderRoute("/");
    await waitFor(() => expect(screen.getByText("Faker Jersey")).toBeInTheDocument());

    const t1Checkbox = await screen.findByRole("checkbox", { name: /t1/i });
    await user.click(t1Checkbox);

    await waitFor(() => {
      expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
      expect(screen.queryByText("Cloud9 Jersey")).not.toBeInTheDocument();
      expect(screen.queryByText("League of Legends Hoodie")).not.toBeInTheDocument();
    });
  });

  it("URL reflects the active team filter", async () => {
    const user = userEvent.setup();
    const { router } = renderRoute("/");
    await waitFor(() => expect(screen.getByText("Faker Jersey")).toBeInTheDocument());

    const t1Checkbox = await screen.findByRole("checkbox", { name: /t1/i });
    await user.click(t1Checkbox);

    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({ team: "t1" });
    });
  });

  it("unchecking a filter restores the full catalog", async () => {
    const user = userEvent.setup();
    renderRoute("/?team=t1");
    await waitFor(() => expect(screen.getByText("Faker Jersey")).toBeInTheDocument());
    expect(screen.queryByText("Cloud9 Jersey")).not.toBeInTheDocument();

    const t1Checkbox = await screen.findByRole("checkbox", { name: /t1/i });
    await user.click(t1Checkbox);

    await waitFor(() => {
      expect(screen.getByText("Cloud9 Jersey")).toBeInTheDocument();
      expect(screen.getByText("League of Legends Hoodie")).toBeInTheDocument();
    });
  });

  it("combining Game and Team filters uses AND logic", async () => {
    const user = userEvent.setup();
    renderRoute("/");
    await waitFor(() => expect(screen.getByText("Faker Jersey")).toBeInTheDocument());

    const lolCheckbox = await screen.findByRole("checkbox", { name: /league of legends/i });
    await user.click(lolCheckbox);
    const t1Checkbox = await screen.findByRole("checkbox", { name: /t1/i });
    await user.click(t1Checkbox);

    await waitFor(() => {
      expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
      expect(screen.queryByText("Cloud9 Jersey")).not.toBeInTheDocument();
      expect(screen.queryByText("Valorant Team Jersey")).not.toBeInTheDocument();
    });
  });

  it("sharing URL with filter params renders same filtered view", async () => {
    renderRoute("/?game=lol&team=t1");
    await waitFor(() => {
      expect(screen.getByText("Faker Jersey")).toBeInTheDocument();
      expect(screen.queryByText("Cloud9 Jersey")).not.toBeInTheDocument();
      expect(screen.queryByText("Valorant Team Jersey")).not.toBeInTheDocument();
    });
  });
});
