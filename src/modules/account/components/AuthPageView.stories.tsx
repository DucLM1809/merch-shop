import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Box, Text } from "@chakra-ui/react";
import { AuthPageView } from "./AuthPageView";

const meta = {
  component: AuthPageView,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AuthPageView>;

export default meta;
type Story = StoryObj<typeof meta>;

const AuthFormPlaceholder = ({ label }: { label: string }) => (
  <Box w="360px" textAlign="center">
    <Text color="fg" fontWeight="700" mb={2}>
      {label}
    </Text>
    <Text color="fg.subtle" fontSize="sm">
      Auth form renders here
    </Text>
  </Box>
);

export const SignIn: Story = {
  args: {
    children: <AuthFormPlaceholder label="Sign In" />,
  },
};

export const SignUp: Story = {
  args: {
    children: <AuthFormPlaceholder label="Create Account" />,
  },
};
