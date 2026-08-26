import type { JSX } from "react";

import { Box, Button, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormField } from "@/components/FormField";
import { useForgotPassword } from "../hooks";
import { schema, DEFAULTS, type FormValues } from "./ForgotPasswordForm.schema";

export function ForgotPasswordForm(): JSX.Element {
  const { t } = useTranslation("account");
  const forgotPassword = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });

  function onSubmit(values: FormValues): void {
    forgotPassword.mutate(values);
  }

  if (forgotPassword.isSuccess) {
    return (
      <Box w="full" maxW="360px" textAlign="center">
        <Heading size="lg" color="fg" fontWeight="800" mb={3}>
          {t("forgotPassword.sentTitle")}
        </Heading>
        <Text color="fg.muted" data-testid="forgot-password-success">
          {t("forgotPassword.sentBody")}
        </Text>
      </Box>
    );
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full" maxW="360px">
      <VStack gap={4} align="stretch">
        <Heading size="lg" color="fg" fontWeight="800">
          {t("forgotPassword.title")}
        </Heading>

        <FormField
          name="email"
          label={t("fields.email")}
          error={errors.email && t("validation.email")}
          required
        >
          <Input id="email" type="email" placeholder={t("fields.email")} {...register("email")} />
        </FormField>

        <Button type="submit" colorPalette="blue" size="lg" fontWeight="700" loading={isSubmitting}>
          {t("forgotPassword.submit")}
        </Button>
      </VStack>
    </Box>
  );
}
