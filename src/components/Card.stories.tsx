import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Text } from "@chakra-ui/react";

import { Card } from "./Card";

const meta = {
  component: Card,
  parameters: { layout: "padded" },
  args: {
    p: 5,
    w: "280px",
    children: (
      <>
        <Text textStyle="h3" mb={1}>
          Faker Jersey
        </Text>
        <Text color="fg.muted">Official T1 away kit replica</Text>
      </>
    ),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  args: { interactive: true },
};

export const NoClipCorner: Story = {
  args: { clipCorner: false },
};
