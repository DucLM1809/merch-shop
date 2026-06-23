import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { FacetFilterView } from './FacetFilterView'

const meta = {
  component: FacetFilterView,
  parameters: { layout: 'padded' },
  args: {
    onGameChange: fn(),
    onTeamChange: fn(),
    onCharacterChange: fn(),
  },
} satisfies Meta<typeof FacetFilterView>

export default meta
type Story = StoryObj<typeof meta>

const games = [
  { id: 'lol', slug: 'league-of-legends', name: 'League of Legends', publisherId: 'riot' },
  { id: 'val', slug: 'valorant', name: 'Valorant', publisherId: 'riot' },
  { id: 'cs2', slug: 'cs2', name: 'CS2', publisherId: 'valve' },
]
const teams = [
  { id: 't1', slug: 't1', name: 'T1', gameId: 'lol' },
  { id: 'c9', slug: 'cloud9', name: 'Cloud9', gameId: 'lol' },
]
const characters = [
  { id: 'azir', slug: 'azir', name: 'Azir', gameId: 'lol' },
  { id: 'jett', slug: 'jett', name: 'Jett', gameId: 'val' },
]

export const NoSelection: Story = {
  args: { games, teams, characters, selectedGame: undefined, selectedTeam: undefined, selectedCharacter: undefined },
}

export const GameSelected: Story = {
  args: { games, teams, characters, selectedGame: 'lol', selectedTeam: undefined, selectedCharacter: undefined },
}

export const TeamSelected: Story = {
  args: { games, teams, characters, selectedGame: undefined, selectedTeam: 't1', selectedCharacter: undefined },
}

export const MultipleActive: Story = {
  args: { games, teams, characters, selectedGame: 'lol', selectedTeam: 't1', selectedCharacter: 'azir' },
}
