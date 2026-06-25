import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders } from '@/test-utils'
import { FacetFilterView } from './FacetFilterView'

const games = [
  { id: 'lol', slug: 'league-of-legends', name: 'League of Legends', publisherId: 'riot' },
  { id: 'val', slug: 'valorant', name: 'Valorant', publisherId: 'riot' },
]
const teams = [{ id: 't1', slug: 't1', name: 'T1', gameId: 'lol' }]
const characters = [{ id: 'azir', slug: 'azir', name: 'Azir', gameId: 'lol' }]

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
    />,
  )
}

describe('FacetFilterView', () => {
  it('renders game, team, and character options', () => {
    renderFilter()
    expect(screen.getByRole('checkbox', { name: 'League of Legends' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Valorant' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'T1' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Azir' })).toBeInTheDocument()
  })

  it('renders nothing when all lists are empty', () => {
    renderFilter({ games: [], teams: [], characters: [] })
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('calls onGameChange with id when game checkbox clicked', async () => {
    const onGameChange = vi.fn()
    renderFilter({ onGameChange })
    await userEvent.click(screen.getByRole('checkbox', { name: 'League of Legends' }))
    expect(onGameChange).toHaveBeenCalledWith('lol')
  })

  it('calls onGameChange with undefined when selected game deselected', async () => {
    const onGameChange = vi.fn()
    renderFilter({ selectedGame: 'lol', onGameChange })
    await userEvent.click(screen.getByRole('checkbox', { name: 'League of Legends' }))
    expect(onGameChange).toHaveBeenCalledWith(undefined)
  })

  it('calls onTeamChange when team checkbox clicked', async () => {
    const onTeamChange = vi.fn()
    renderFilter({ onTeamChange })
    await userEvent.click(screen.getByRole('checkbox', { name: 'T1' }))
    expect(onTeamChange).toHaveBeenCalledWith('t1')
  })

  it('calls onCharacterChange when character checkbox clicked', async () => {
    const onCharacterChange = vi.fn()
    renderFilter({ onCharacterChange })
    await userEvent.click(screen.getByRole('checkbox', { name: 'Azir' }))
    expect(onCharacterChange).toHaveBeenCalledWith('azir')
  })
})
