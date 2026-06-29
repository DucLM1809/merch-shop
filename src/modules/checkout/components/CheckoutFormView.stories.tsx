import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { fn } from "storybook/test";
import { Input } from "@chakra-ui/react";
import type { UseFormRegister } from "react-hook-form";

import { CheckoutFormView } from "./CheckoutFormView";
import type { FormValues } from "./CheckoutFormView.schema";

const mockRegister = ((name: string) => ({
  name,
  ref: fn(),
  onChange: fn(),
  onBlur: fn(),
})) as unknown as UseFormRegister<FormValues>;

const meta = {
  component: CheckoutFormView,
  parameters: { layout: "padded" },
  args: {
    register: mockRegister,
    errors: {},
    paymentError: null,
    isSubmitting: false,
    total: 59.99,
    onSubmit: fn(),
    cardSlot: <Input placeholder="Card number (mock)" readOnly />,
  },
} satisfies Meta<typeof CheckoutFormView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const ValidationErrors: Story = {
  args: {
    errors: {
      fullName: { type: "required", message: "Full name is required" },
      email: { type: "required", message: "Email is required" },
      line1: { type: "required", message: "Address is required" },
      city: { type: "required", message: "City is required" },
      state: { type: "required", message: "State is required" },
      postalCode: { type: "required", message: "Postal code is required" },
      country: { type: "required", message: "Country is required" },
    },
  },
};

export const PaymentDeclined: Story = {
  args: {
    paymentError: "Your card was declined.",
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
