import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderRoute } from '../test-utils'

// Mock Clerk — provide both signed-in and signed-out states
vi.mock('@clerk/react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
  useUser: vi.fn(),
  useClerk: vi.fn(() => ({ signOut: vi.fn() })),
  SignIn: () => <div data-testid="clerk-sign-in">Sign In Form</div>,
  SignUp: () => <div data-testid="clerk-sign-up">Sign Up Form</div>,
}))

import { useAuth, useUser } from '@clerk/react'

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>
const mockUseUser = useUser as ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GlobalNav auth state', () => {
  it('shows sign-in and sign-up links when guest', async () => {
    mockUseAuth.mockReturnValue({ isSignedIn: false })
    mockUseUser.mockReturnValue({ user: null })

    renderRoute('/')

    expect(await screen.findByTestId('nav-guest-links')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.queryByTestId('nav-account-menu')).not.toBeInTheDocument()
  })

  it('shows account menu and hides guest links when signed in', async () => {
    mockUseAuth.mockReturnValue({ isSignedIn: true })
    mockUseUser.mockReturnValue({
      user: {
        firstName: 'Faker',
        emailAddresses: [{ emailAddress: 'faker@t1.gg' }],
      },
    })

    renderRoute('/')

    expect(await screen.findByTestId('nav-account-menu')).toBeInTheDocument()
    expect(screen.getByText('Faker')).toBeInTheDocument()
    expect(screen.queryByTestId('nav-guest-links')).not.toBeInTheDocument()
  })
})

describe('/sign-in route', () => {
  it('renders Clerk SignIn component', async () => {
    mockUseAuth.mockReturnValue({ isSignedIn: false })
    mockUseUser.mockReturnValue({ user: null })

    renderRoute('/sign-in')

    expect(await screen.findByTestId('clerk-sign-in')).toBeInTheDocument()
  })
})

describe('/sign-up route', () => {
  it('renders Clerk SignUp component', async () => {
    mockUseAuth.mockReturnValue({ isSignedIn: false })
    mockUseUser.mockReturnValue({ user: null })

    renderRoute('/sign-up')

    expect(await screen.findByTestId('clerk-sign-up')).toBeInTheDocument()
  })
})
