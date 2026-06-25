import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { describe, it, expect } from 'vitest'
import { PublisherNavView } from './PublisherNavView'
import { publishers } from '@/mocks/handlers'
function renderView(props: Partial<React.ComponentProps<typeof PublisherNavView>> = {}) {
  const defaultProps: React.ComponentProps<typeof PublisherNavView> = {
    publishers: publishers,
    isLoading: false,
    renderLink: (to, _params, children, ariaCurrent) => (
      <a href={to} aria-current={ariaCurrent}>
        {children}
      </a>
    ),
    ...props,
  }
  return render(
    <ChakraProvider value={defaultSystem}>
      <PublisherNavView {...defaultProps} />
    </ChakraProvider>,
  )
}

describe('PublisherNavView', () => {
  it('renders publisher names as links', () => {
    renderView()
    expect(screen.getByRole('link', { name: 'Riot Games' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Valve' })).toBeInTheDocument()
  })

  it('renders game names under their publishers', () => {
    renderView()
    expect(screen.getByRole('link', { name: 'League of Legends' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Valorant' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'CS2' })).toBeInTheDocument()
  })

  it('shows skeleton loading state when isLoading is true', () => {
    renderView({ publishers: undefined, isLoading: true })
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('marks active publisher with aria-current="page"', () => {
    renderView({ activePublisherSlug: 'riot' })
    expect(screen.getByRole('link', { name: 'Riot Games' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Valve' })).not.toHaveAttribute('aria-current')
  })

  it('marks active game with aria-current="page"', () => {
    renderView({ activePublisherSlug: 'riot', activeGameSlug: 'league-of-legends' })
    expect(screen.getByRole('link', { name: 'League of Legends' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Valorant' })).not.toHaveAttribute('aria-current')
  })
})
