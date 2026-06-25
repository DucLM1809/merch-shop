import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '@/test-utils'
import { PublisherPageView } from './PublisherPageView'
import { publishers } from '@/mocks/handlers'

describe('PublisherPageView', () => {
  it('shows skeletons and no heading when loading', () => {
    renderWithProviders(<PublisherPageView publisher={undefined} isLoading={true} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('shows publisher name when loaded', () => {
    renderWithProviders(<PublisherPageView publisher={publishers[0]} isLoading={false} />)
    expect(screen.getByRole('heading', { name: 'Riot Games' })).toBeInTheDocument()
  })

  it('shows game count when loaded', () => {
    renderWithProviders(<PublisherPageView publisher={publishers[0]} isLoading={false} />)
    expect(screen.getByText('2 games')).toBeInTheDocument()
  })
})
