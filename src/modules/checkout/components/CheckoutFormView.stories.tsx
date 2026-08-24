import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { fn } from "storybook/test";
import { Input } from "@chakra-ui/react";
import type { UseFormRegister } from "react-hook-form";

import { CheckoutFormView } from "./CheckoutFormView";
import { VALIDATION_KEYS } from "./CheckoutFormView.schema";
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

// The messages are keys, same as react-hook-form would carry them out of the schema — the
// view is what turns them into sentences, and this story is where that shows.
export const ValidationErrors: Story = {
  args: {
    errors: {
      fullName: { type: "required", message: VALIDATION_KEYS.fullName },
      email: { type: "required", message: VALIDATION_KEYS.email },
      line1: { type: "required", message: VALIDATION_KEYS.line1 },
      city: { type: "required", message: VALIDATION_KEYS.city },
      state: { type: "required", message: VALIDATION_KEYS.state },
      postalCode: { type: "required", message: VALIDATION_KEYS.postalCode },
      country: { type: "required", message: VALIDATION_KEYS.country },
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
