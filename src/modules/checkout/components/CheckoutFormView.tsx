import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";

import type { JSX, ReactNode } from "react";

import { FormField } from "@/components/FormField";
import type { ShippingAddress } from "@/api/types";

export type FieldErrors = {
  fullName?: string;
  email?: string;
  line1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

type Props = {
  fields: Partial<ShippingAddress>;
  errors: FieldErrors;
  paymentError: string | null;
  submitting: boolean;
  total: number;
  onFieldChange: (name: keyof ShippingAddress, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  cardSlot: ReactNode;
};

export function CheckoutFormView({
  fields,
  errors,
  paymentError,
  submitting,
  total,
  onFieldChange,
  onSubmit,
  cardSlot,
}: Props): JSX.Element {
  function field(name: keyof ShippingAddress) {
    return {
      value: fields[name] ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(name, e.target.value),
    };
  }

  return (
    <Box as="form" onSubmit={onSubmit}>
      <VStack gap={4} align="stretch">
        <Heading size="xl" color="white" fontWeight="800">
          Checkout
        </Heading>

        <Heading
          size="sm"
          color="gray.400"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.05em"
        >
          Shipping
        </Heading>

        <FormField label="Full Name" error={errors.fullName}>
          <Input placeholder="Full Name" {...field("fullName")} />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <Input placeholder="Email" type="email" {...field("email")} />
        </FormField>
        <FormField label="Address" error={errors.line1}>
          <Input placeholder="Street address" {...field("line1")} />
        </FormField>
        <Input placeholder="Apartment, suite, etc. (optional)" {...field("line2")} />
        <Flex gap={3}>
          <FormField label="City" error={errors.city} flex="1">
            <Input placeholder="City" {...field("city")} />
          </FormField>
          <FormField label="State" error={errors.state} flex="1">
            <Input placeholder="State" {...field("state")} />
          </FormField>
        </Flex>
        <Flex gap={3}>
          <FormField label="Postal Code" error={errors.postalCode} flex="1">
            <Input placeholder="Postal code" {...field("postalCode")} />
          </FormField>
          <FormField label="Country" error={errors.country} flex="1">
            <Input placeholder="Country" {...field("country")} />
          </FormField>
        </Flex>

        <Heading
          size="sm"
          color="gray.400"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.05em"
          mt={2}
        >
          Payment
        </Heading>
        <Box p={3} borderRadius="md" border="1px solid" borderColor="gray.700" bg="gray.900">
          {cardSlot}
        </Box>

        {paymentError && (
          <Text color="red.400" fontSize="sm" data-testid="payment-error">
            {paymentError}
          </Text>
        )}

        <Button
          type="submit"
          colorPalette="blue"
          size="lg"
          fontWeight="700"
          loading={submitting}
          mt={2}
        >
          Pay ${total.toFixed(2)}
        </Button>
      </VStack>
    </Box>
  );
}
