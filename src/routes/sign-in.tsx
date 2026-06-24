import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/react'
import { Flex } from '@chakra-ui/react'

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  return (
    <Flex justify="center" align="center" minH="80vh">
      <SignIn routing="path" path="/sign-in" />
    </Flex>
  )
}
