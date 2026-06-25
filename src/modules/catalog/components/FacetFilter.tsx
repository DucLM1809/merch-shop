import type { JSX } from 'react'

import { useNavigate, useSearch } from '@tanstack/react-router'

import { FacetFilterView } from './FacetFilterView'

import { usePublishers, useTeams, useCharacters } from '../hooks'

export function FacetFilter(): JSX.Element {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })

  const { data: publishers = [] } = usePublishers()
  const { data: teams = [] } = useTeams()
  const { data: characters = [] } = useCharacters()

  const games = publishers.flatMap((p) => p.games)

  function setParam(key: 'game' | 'team' | 'character', value: string | undefined): void {
    navigate({
      search: (prev) => ({ ...prev, [key]: value }),
      replace: true,
    })
  }

  return (
    <FacetFilterView
      games={games}
      teams={teams}
      characters={characters}
      selectedGame={search.game}
      selectedTeam={search.team}
      selectedCharacter={search.character}
      onGameChange={(v) => setParam('game', v)}
      onTeamChange={(v) => setParam('team', v)}
      onCharacterChange={(v) => setParam('character', v)}
    />
  )
}
