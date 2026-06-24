import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignUp, useAuth } from '@clerk/react'
import { Flex } from '@chakra-ui/react'
import { useEffect } from 'react'

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
    <Flex justify="center" align="center" minH="80vh">
      <SignUp routing="path" path="/sign-up" fallbackRedirectUrl="/" />
    </Flex>
  )
}
