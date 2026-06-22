import { screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../test-utils'
import { ProductCatalog } from '../components/ProductCatalog'

describe('Product catalog', () => {
  it('renders a product card for each product', async () => {
    renderWithProviders(<ProductCatalog />)
    await waitFor(() => {
      expect(screen.getByText('Faker Jersey')).toBeInTheDocument()
      expect(screen.getByText('League of Legends Hoodie')).toBeInTheDocument()
    })
  })

  it('filters to a single publisher', async () => {
    renderWithProviders(<ProductCatalog filters={{ publisher: 'riot' }} />)
    await waitFor(() => {
      expect(screen.getByText('Faker Jersey')).toBeInTheDocument()
      expect(screen.queryByText('CS2 Team Jersey')).not.toBeInTheDocument()
    })
  })

  it('filters to a single game by slug', async () => {
    renderWithProviders(<ProductCatalog filters={{ gameSlug: 'league-of-legends' }} />)
    await waitFor(() => {
      expect(screen.getByText('Faker Jersey')).toBeInTheDocument()
      expect(screen.queryByText('Valorant Team Jersey')).not.toBeInTheDocument()
      expect(screen.queryByText('CS2 Team Jersey')).not.toBeInTheDocument()
    })
  })
})
