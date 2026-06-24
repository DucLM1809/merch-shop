import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Box, Text } from '@chakra-ui/react'
import { AuthPageView } from './AuthPageView'

const meta = {
  component: AuthPageView,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AuthPageView>

export default meta
type Story = StoryObj<typeof meta>

const ClerkPlaceholder = ({ label }: { label: string }) => (
  <Box
    p={8}
    borderRadius="xl"
    bg="gray.900"
    w="400px"
    border="1px solid"
    borderColor="gray.800"
    textAlign="center"
  >
    <Text color="white" fontWeight="700" mb={2}>{label}</Text>
    <Text color="gray.500" fontSize="sm">Clerk widget renders here</Text>
  </Box>
)

export const SignIn: Story = {
  args: {
    children: <ClerkPlaceholder label="Sign In" />,
  },
}

export const SignUp: Story = {
  args: {
    children: <ClerkPlaceholder label="Create Account" />,
  },
}
