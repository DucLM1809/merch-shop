import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { PublisherPageView } from './PublisherPageView'
import { publishers } from '@/mocks/handlers'

const meta: Meta<typeof PublisherPageView> = {
  component: PublisherPageView,
  title: 'Components/PublisherPageView',
}
export default meta

type Story = StoryObj<typeof PublisherPageView>

export const Loading: Story = {
  args: {
    publisher: undefined,
    isLoading: true,
  },
}

export const Loaded: Story = {
  args: {
    publisher: publishers[0],
    isLoading: false,
  },
}
