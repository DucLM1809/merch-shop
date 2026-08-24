import type { JSX } from "react";

import { Box, Button, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormField } from "@/components/FormField";
import { useLocale } from "@/i18n/useLocale";
import { useResetPassword } from "../hooks";
import { PASSWORD_MIN_LENGTH } from "../passwordPolicy";
import { schema, DEFAULTS, type FormValues } from "./ResetPasswordForm.schema";

type Props = {
  token: string;
};

export function ResetPasswordForm({ token }: Props): JSX.Element {
  const { t } = useTranslation("account");
  const resetPassword = useResetPassword();
  const locale = useLocale();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });

  async function onSubmit(values: FormValues): Promise<void> {
    try {
      await resetPassword.mutateAsync({ token, newPassword: values.newPassword });
    } catch {
      setError("root", { message: t("resetPassword.failed") });
    }
  }

  if (resetPassword.isSuccess) {
    return (
      <Box w="full" maxW="360px" textAlign="center">
        <Heading size="lg" color="white" fontWeight="800" mb={3}>
          {t("resetPassword.doneTitle")}
        </Heading>
        <Text color="gray.400" mb={4} data-testid="reset-password-success">
          {t("resetPassword.doneBody")}
        </Text>
        <Link to="/$locale/sign-in" params={{ locale }}>
          <Button colorPalette="blue">{t("resetPassword.goToSignIn")}</Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full" maxW="360px">
      <VStack gap={4} align="stretch">
        <Heading size="lg" color="white" fontWeight="800">
          {t("resetPassword.title")}
        </Heading>

        <FormField
          name="newPassword"
          label={t("resetPassword.newPassword")}
          error={errors.newPassword && t("validation.passwordMin", { min: PASSWORD_MIN_LENGTH })}
        >
          <Input
            id="newPassword"
            type="password"
            placeholder={t("resetPassword.newPasswordPlaceholder", { min: PASSWORD_MIN_LENGTH })}
            {...register("newPassword")}
          />
        </FormField>

        {errors.root && (
          <Text color="red.400" fontSize="sm" data-testid="reset-password-error">
            {errors.root.message}
          </Text>
        )}

        <Button type="submit" colorPalette="blue" size="lg" fontWeight="700" loading={isSubmitting}>
          {t("resetPassword.submit")}
        </Button>
      </VStack>
    </Box>
  );
}
