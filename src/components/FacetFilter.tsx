import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { client } from '../api/client'
import { FacetFilterView } from './ui/FacetFilterView'

export function FacetFilter() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })

  const { data: publishers = [] } = useQuery({
    queryKey: ['publishers'],
    queryFn: () => client.getPublishers(),
  })
  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => client.getTeams(),
  })
  const { data: characters = [] } = useQuery({
    queryKey: ['characters'],
    queryFn: () => client.getCharacters(),
  })

  const games = publishers.flatMap((p) => p.games)

  function setParam(key: 'game' | 'team' | 'character', value: string | undefined) {
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
