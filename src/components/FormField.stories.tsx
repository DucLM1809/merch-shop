import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Input } from "@chakra-ui/react";

import { FormField } from "./FormField";

const meta = {
  component: FormField,
  parameters: { layout: "padded" },
  args: {
    name: "fieldName",
    children: <Input placeholder="Input value" />,
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Full Name",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    error: { type: "required", message: "Email is required" },
  },
};

export const WithStringError: Story = {
  args: {
    label: "Postal Code",
    error: "Must be a valid postal code",
  },
};

export const NoLabel: Story = {};

export const WithFlex: Story = {
  args: {
    label: "City",
    flex: "1",
  },
};
