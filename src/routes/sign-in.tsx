import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignIn, useAuth } from '@clerk/react'
import { useEffect } from 'react'
import { AuthPageView } from '../components/ui/AuthPageView'

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSignedIn) navigate({ to: '/' })
  }, [isSignedIn, navigate])

  if (isSignedIn) return null

  return (
    <AuthPageView>
      <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/" />
    </AuthPageView>
  )
}
