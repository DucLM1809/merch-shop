import type { Meta, StoryObj } from "@storybook/tanstack-react";

import { Breadcrumb } from "./Breadcrumb";

const renderLink = (to: string, _params: Record<string, string> | undefined, label: string) => (
  <a href={to}>{label}</a>
);

const meta = {
  component: Breadcrumb,
  parameters: { layout: "padded" },
  args: {
    renderLink,
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProductPage: Story = {
  args: {
    items: [
      { label: "Riot Games", to: "/riot-games" },
      { label: "League of Legends", to: "/riot-games/league-of-legends" },
      { label: "Faker Jersey" },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [{ label: "Riot Games", to: "/riot-games" }, { label: "League of Legends" }],
  },
};
