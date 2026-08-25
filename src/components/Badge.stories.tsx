import type { Meta, StoryObj } from "@storybook/tanstack-react";

import { Badge } from "./Badge";

const meta = {
  component: Badge,
  parameters: { layout: "padded" },
  args: {
    children: "Shipped",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Status: Story = {
  args: { variant: "status", tone: "success" },
};

export const StatusDanger: Story = {
  args: { variant: "status", tone: "danger", children: "Cancelled" },
};

export const StatusWarning: Story = {
  args: { variant: "status", tone: "warning", children: "Pending" },
};

export const Count: Story = {
  args: { variant: "count", tone: "signal", children: "3" },
};
