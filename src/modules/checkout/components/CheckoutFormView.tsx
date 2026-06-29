import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import type { JSX, ReactNode } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { FormField } from "@/components/FormField";
import type { FormValues } from "./CheckoutFormView.schema";

type Props = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  paymentError: string | null;
  isSubmitting: boolean;
  total: number;
  onSubmit: (e: React.FormEvent) => void;
  cardSlot: ReactNode;
};

export function CheckoutFormView({
  register,
  errors,
  paymentError,
  isSubmitting,
  total,
  onSubmit,
  cardSlot,
}: Props): JSX.Element {
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

        <FormField name="fullName" label="Full Name" error={errors.fullName}>
          <Input id="fullName" placeholder="Full Name" {...register("fullName")} />
        </FormField>
        <FormField name="email" label="Email" error={errors.email}>
          <Input id="email" placeholder="Email" type="email" {...register("email")} />
        </FormField>
        <FormField name="line1" label="Address" error={errors.line1}>
          <Input id="line1" placeholder="Street address" {...register("line1")} />
        </FormField>
        <Input placeholder="Apartment, suite, etc. (optional)" {...register("line2")} />
        <Flex gap={3}>
          <FormField name="city" label="City" error={errors.city} flex="1">
            <Input id="city" placeholder="City" {...register("city")} />
          </FormField>
          <FormField name="state" label="State" error={errors.state} flex="1">
            <Input id="state" placeholder="State" {...register("state")} />
          </FormField>
        </Flex>
        <Flex gap={3}>
          <FormField name="postalCode" label="Postal Code" error={errors.postalCode} flex="1">
            <Input id="postalCode" placeholder="Postal code" {...register("postalCode")} />
          </FormField>
          <FormField name="country" label="Country" error={errors.country} flex="1">
            <Input id="country" placeholder="Country" {...register("country")} />
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
          loading={isSubmitting}
          mt={2}
        >
          Pay ${total.toFixed(2)}
        </Button>
      </VStack>
    </Box>
  );
}
