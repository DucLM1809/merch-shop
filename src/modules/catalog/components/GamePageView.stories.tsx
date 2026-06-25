import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { GamePageView } from './GamePageView'
import { publishers } from '@/mocks/handlers'

const riotGames = publishers.find((p) => p.slug === 'riot')!

const meta: Meta<typeof GamePageView> = {
  component: GamePageView,
  title: 'Components/GamePageView',
}
export default meta

type Story = StoryObj<typeof GamePageView>

export const Loading: Story = {
  args: {
    gameName: undefined,
    publisherName: undefined,
    accentColor: undefined,
    isLoading: true,
  },
}

export const Loaded: Story = {
  args: {
    gameName: 'League of Legends',
    publisherName: riotGames.name,
    accentColor: riotGames.accentColor,
    isLoading: false,
  },
}
