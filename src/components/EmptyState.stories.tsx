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
