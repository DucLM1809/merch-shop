import type { JSX } from "react";

import { FacetFilterView } from "./FacetFilterView";

import { usePublishers, useTeams, useCharacters } from "../hooks";

export type FacetFilterSearch = {
  game: string | undefined;
  team: string | undefined;
  character: string | undefined;
};

type FacetFilterProps = {
  search: FacetFilterSearch;
  onFilterChange: (key: "game" | "team" | "character", value: string | undefined) => void;
};

// Takes the shop route's search state and setter as props rather than reading `useSearch`/
// `useNavigate` itself: this route lives inside the `(catalog)` pathless group, and the
// group-nested route's static `fullPath` type doesn't line up with its runtime `fullPath`
// in this TanStack Router/router-plugin version combo (the admin route shows the same
// mismatch), so a string-keyed `from` here can't type-check. The owning route already
// calls `Route.useSearch()`/`Route.useNavigate()` against its own bound `Route` object,
// which sidesteps the mismatch entirely.
export function FacetFilter({ search, onFilterChange }: FacetFilterProps): JSX.Element {
  const { data: publishers = [] } = usePublishers();
  const { data: teams = [] } = useTeams();
  const { data: characters = [] } = useCharacters();

  const games = publishers.flatMap((p) => p.games);

  return (
    <FacetFilterView
      games={games}
      teams={teams}
      characters={characters}
      selectedGame={search.game}
      selectedTeam={search.team}
      selectedCharacter={search.character}
      onGameChange={(v) => onFilterChange("game", v)}
      onTeamChange={(v) => onFilterChange("team", v)}
      onCharacterChange={(v) => onFilterChange("character", v)}
    />
  );
}
