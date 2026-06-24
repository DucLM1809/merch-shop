import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignIn, useAuth } from '@clerk/react'
import { Flex } from '@chakra-ui/react'
import { useEffect } from 'react'

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
    <Flex justify="center" align="center" minH="80vh">
      <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/" />
    </Flex>
  )
}
