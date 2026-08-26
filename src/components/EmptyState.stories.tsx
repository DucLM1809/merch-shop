import { Button } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { PackageX } from "lucide-react";

import { EmptyState } from "./EmptyState";

const meta = {
  component: EmptyState,
  parameters: { layout: "padded" },
  args: {
    title: "No products found",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {};

export const WithDescription: Story = {
  args: {
    description: "Try removing a filter to see more results.",
  },
};

export const WithIcon: Story = {
  args: {
    description: "Try removing a filter to see more results.",
    icon: <PackageX size={32} strokeWidth={1.5} />,
  },
};

export const WithAction: Story = {
  args: {
    description: "Try removing a filter to see more results.",
    icon: <PackageX size={32} strokeWidth={1.5} />,
    children: <Button size="sm">Clear filters</Button>,
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    description: "This image failed to load.",
    icon: <PackageX size={22} strokeWidth={1.5} />,
  },
};
