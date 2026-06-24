import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/react'
import { Flex } from '@chakra-ui/react'

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <Flex justify="center" align="center" minH="80vh">
      <SignUp routing="path" path="/sign-up" />
    </Flex>
  )
}
