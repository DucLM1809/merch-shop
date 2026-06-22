import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { PublisherNavView } from './PublisherNavView'
import { publishers } from '../../mocks/handlers'
import type { ReactNode } from 'react'

const meta: Meta<typeof PublisherNavView> = {
  component: PublisherNavView,
  title: 'Components/PublisherNavView',
  args: {
    renderLink: (to, params, children, ariaCurrent) => (
      <a href={to} aria-current={ariaCurrent}>
        {children}
      </a>
    ),
  },
}
export default meta

type Story = StoryObj<typeof PublisherNavView>

export const Loading: Story = {
  args: {
    publishers: undefined,
    isLoading: true,
  },
}

export const Default: Story = {
  args: {
    publishers,
    isLoading: false,
  },
}

export const PublisherActive: Story = {
  args: {
    publishers,
    isLoading: false,
    activePublisherSlug: 'riot',
  },
}

export const GameActive: Story = {
  args: {
    publishers,
    isLoading: false,
    activePublisherSlug: 'riot',
    activeGameSlug: 'league-of-legends',
  },
}
