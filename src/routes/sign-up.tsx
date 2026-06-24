import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignUp, useAuth } from '@clerk/react'
import { useEffect } from 'react'
import { AuthPageView } from '../components/ui/AuthPageView'

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSignedIn) navigate({ to: '/' })
  }, [isSignedIn, navigate])

  if (isSignedIn) return null

  return (
    <AuthPageView>
      <SignUp routing="path" path="/sign-up" fallbackRedirectUrl="/" />
    </AuthPageView>
  )
}
