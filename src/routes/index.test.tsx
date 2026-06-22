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
})
