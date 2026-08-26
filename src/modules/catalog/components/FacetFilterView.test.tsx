import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import catalogCopy from "@/i18n/locales/en-US/catalog.json";
import { expectNoA11yViolations, renderWithProviders } from "@/test-utils";
import { FacetFilterView } from "./FacetFilterView";

const games = [
  { id: "lol", slug: "league-of-legends", name: "League of Legends", publisherId: "riot" },
  { id: "val", slug: "valorant", name: "Valorant", publisherId: "riot" },
];
const teams = [{ id: "t1", slug: "t1", name: "T1", gameId: "lol" }];
const characters = [{ id: "azir", slug: "azir", name: "Azir", gameId: "lol" }];

function renderFilter(overrides: Partial<Parameters<typeof FacetFilterView>[0]> = {}) {
  return renderWithProviders(
    <FacetFilterView
      games={games}
      teams={teams}
      characters={characters}
      selectedGame={undefined}
      selectedTeam={undefined}
      selectedCharacter={undefined}
      onGameChange={vi.fn()}
      onTeamChange={vi.fn()}
      onCharacterChange={vi.fn()}
      {...overrides}
    />
  );
}

describe("FacetFilterView", () => {
  it("renders game, team, and character options", () => {
    renderFilter();
    expect(screen.getByRole("checkbox", { name: "League of Legends" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Valorant" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "T1" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Azir" })).toBeInTheDocument();
  });

  it("labels each facet group with the translated copy", () => {
    renderFilter();
    expect(screen.getByText(catalogCopy.filters.game)).toBeInTheDocument();
    expect(screen.getByText(catalogCopy.filters.team)).toBeInTheDocument();
    expect(screen.getByText(catalogCopy.filters.character)).toBeInTheDocument();
  });

  it("renders nothing when all lists are empty", () => {
    renderFilter({ games: [], teams: [], characters: [] });
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("calls onGameChange with id when game checkbox clicked", async () => {
    const onGameChange = vi.fn();
    renderFilter({ onGameChange });
    await userEvent.click(screen.getByRole("checkbox", { name: "League of Legends" }));
    expect(onGameChange).toHaveBeenCalledWith("lol");
  });

  it("calls onGameChange with undefined when selected game deselected", async () => {
    const onGameChange = vi.fn();
    renderFilter({ selectedGame: "lol", onGameChange });
    await userEvent.click(screen.getByRole("checkbox", { name: "League of Legends" }));
    expect(onGameChange).toHaveBeenCalledWith(undefined);
  });

  it("calls onTeamChange when team checkbox clicked", async () => {
    const onTeamChange = vi.fn();
    renderFilter({ onTeamChange });
    await userEvent.click(screen.getByRole("checkbox", { name: "T1" }));
    expect(onTeamChange).toHaveBeenCalledWith("t1");
  });

  it("calls onCharacterChange when character checkbox clicked", async () => {
    const onCharacterChange = vi.fn();
    renderFilter({ onCharacterChange });
    await userEvent.click(screen.getByRole("checkbox", { name: "Azir" }));
    expect(onCharacterChange).toHaveBeenCalledWith("azir");
  });

  it("does not render the mobile filter trigger when there are no facets", () => {
    renderFilter({ games: [], teams: [], characters: [] });
    expect(
      screen.queryByRole("button", { name: catalogCopy.filters.title })
    ).not.toBeInTheDocument();
  });

  describe("mobile drawer", () => {
    it("opens a drawer with the same filters when the trigger is clicked", async () => {
      const user = userEvent.setup();
      renderFilter();

      await user.click(screen.getByRole("button", { name: catalogCopy.filters.title }));

      const dialog = screen.getByRole("dialog", { name: catalogCopy.filters.title });
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(
        within(dialog).getByRole("checkbox", { name: "League of Legends" })
      ).toBeInTheDocument();
    });

    it("calls the change handler when a checkbox inside the drawer is clicked", async () => {
      const onGameChange = vi.fn();
      const user = userEvent.setup();
      renderFilter({ onGameChange });

      await user.click(screen.getByRole("button", { name: catalogCopy.filters.title }));
      const dialog = screen.getByRole("dialog");
      await user.click(within(dialog).getByRole("checkbox", { name: "League of Legends" }));

      expect(onGameChange).toHaveBeenCalledWith("lol");
    });

    it("closes when the close button is clicked", async () => {
      const user = userEvent.setup();
      renderFilter();

      await user.click(screen.getByRole("button", { name: catalogCopy.filters.title }));
      const dialog = screen.getByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: "Close" }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes on Escape", async () => {
      const user = userEvent.setup();
      renderFilter();

      await user.click(screen.getByRole("button", { name: catalogCopy.filters.title }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes when the overlay is clicked", async () => {
      const user = userEvent.setup();
      renderFilter();

      await user.click(screen.getByRole("button", { name: catalogCopy.filters.title }));
      await user.click(screen.getByTestId("facet-drawer-overlay"));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("has no axe violations", async () => {
      const user = userEvent.setup();
      renderFilter();

      await user.click(screen.getByRole("button", { name: catalogCopy.filters.title }));
      // The drawer renders through a Portal, outside the render container, so scan
      // the dialog itself rather than the container.
      await expectNoA11yViolations(screen.getByRole("dialog"));
    });
  });
});
