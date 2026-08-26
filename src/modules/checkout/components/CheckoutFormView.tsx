import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { JSX, ReactNode } from "react";
import type { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";

import { Badge } from "@/components/Badge";
import { FormField } from "@/components/FormField";
import { useFormatPrice } from "@/i18n/useFormatPrice";
import type { FormValues, ValidationKey } from "./CheckoutFormView.schema";

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
  const { t } = useTranslation("checkout");
  const formatPrice = useFormatPrice();

  // Every message on these fields comes from the schema, which reports `ValidationKey` and
  // nothing else — the cast is the handoff from react-hook-form's plain `string` message
  // back to the key type it started as.
  const errorText = (error: FieldError | undefined): string | undefined =>
    error?.message ? t(error.message as ValidationKey) : undefined;

  return (
    <Box as="form" onSubmit={onSubmit}>
      <VStack gap={4} align="stretch">
        <Heading size="xl" color="fg" fontWeight="800">
          {t("title")}
        </Heading>

        <CheckoutSteps />

        <Heading
          size="sm"
          color="fg.muted"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.05em"
        >
          {t("shipping.heading")}
        </Heading>

        <FormField
          name="fullName"
          label={t("shipping.fullName")}
          error={errorText(errors.fullName)}
          required
        >
          <Input id="fullName" placeholder={t("shipping.fullName")} {...register("fullName")} />
        </FormField>
        <FormField
          name="email"
          label={t("shipping.email")}
          error={errorText(errors.email)}
          required
        >
          <Input id="email" placeholder={t("shipping.email")} type="email" {...register("email")} />
        </FormField>
        <FormField
          name="line1"
          label={t("shipping.address")}
          error={errorText(errors.line1)}
          required
        >
          <Input id="line1" placeholder={t("shipping.addressPlaceholder")} {...register("line1")} />
        </FormField>
        <Input placeholder={t("shipping.line2Placeholder")} {...register("line2")} />
        <Flex gap={3}>
          <FormField
            name="city"
            label={t("shipping.city")}
            error={errorText(errors.city)}
            flex="1"
            required
          >
            <Input id="city" placeholder={t("shipping.city")} {...register("city")} />
          </FormField>
          <FormField
            name="state"
            label={t("shipping.state")}
            error={errorText(errors.state)}
            flex="1"
            required
          >
            <Input id="state" placeholder={t("shipping.state")} {...register("state")} />
          </FormField>
        </Flex>
        <Flex gap={3}>
          <FormField
            name="postalCode"
            label={t("shipping.postalCode")}
            error={errorText(errors.postalCode)}
            flex="1"
            required
          >
            <Input
              id="postalCode"
              placeholder={t("shipping.postalCodePlaceholder")}
              {...register("postalCode")}
            />
          </FormField>
          <FormField
            name="country"
            label={t("shipping.country")}
            error={errorText(errors.country)}
            flex="1"
            required
          >
            <Input id="country" placeholder={t("shipping.country")} {...register("country")} />
          </FormField>
        </Flex>

        <Heading
          size="sm"
          color="fg.muted"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.05em"
          mt={2}
        >
          {t("payment.heading")}
        </Heading>
        <Box
          p={3}
          borderRadius="md"
          border="1px solid"
          borderColor="border.emphasized"
          bg="bg.panel"
        >
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
          {t("payment.pay", { total: formatPrice(total) })}
        </Button>
      </VStack>
    </Box>
  );
}

// Visual/structural only — the two badges below reflect the Shipping-then-Payment order the
// fields already appear in on this single page; submission stays a single onSubmit call.
function CheckoutSteps(): JSX.Element {
  const { t } = useTranslation("checkout");

  return (
    <Flex role="list" aria-label={t("steps.label")} align="center" gap={3}>
      <Box role="listitem" aria-current="step">
        <Badge tone="signal">{`1 · ${t("shipping.heading")}`}</Badge>
      </Box>
      <Box flex="1" h="1px" bg="border.muted" aria-hidden="true" />
      <Box role="listitem">
        <Badge tone="neutral">{`2 · ${t("payment.heading")}`}</Badge>
      </Box>
    </Flex>
  );
}
