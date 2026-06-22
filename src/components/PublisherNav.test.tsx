import { screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { PublisherNav } from './PublisherNav'

describe('PublisherNav', () => {
  it('renders all publishers with their games', async () => {
    renderWithProviders(<PublisherNav />)
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Riot Games' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Valve' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'League of Legends' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'CS2' })).toBeInTheDocument()
    })
  })

  it('marks the active publisher with aria-current', async () => {
    renderWithProviders(<PublisherNav activePublisherSlug="riot" />)
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Riot Games' })).toHaveAttribute(
        'aria-current',
        'page',
      )
      expect(screen.getByRole('link', { name: 'Valve' })).not.toHaveAttribute('aria-current')
    })
  })

  it('marks the active game with aria-current', async () => {
    renderWithProviders(
      <PublisherNav activePublisherSlug="riot" activeGameSlug="league-of-legends" />,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: 'League of Legends' }),
      ).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('link', { name: 'Valorant' })).not.toHaveAttribute('aria-current')
    })
  })
})
