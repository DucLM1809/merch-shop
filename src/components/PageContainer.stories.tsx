import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Box } from "@chakra-ui/react";

import { PageContainer } from "./PageContainer";

const meta = {
  component: PageContainer,
  parameters: { layout: "fullscreen" },
  args: {
    children: (
      <Box bg="bg.panel" borderWidth="1px" borderColor="border.muted" borderRadius="lg" p={6}>
        Content constrained to the container&apos;s max width
      </Box>
    ),
  },
} satisfies Meta<typeof PageContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {
  args: { size: "lg" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Small: Story = {
  args: { size: "sm" },
};
