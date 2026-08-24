import type { JSX } from "react";

import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormField } from "@/components/FormField";
import { useLocale } from "@/i18n/useLocale";
import { useLogin } from "../hooks";
import { schema, DEFAULTS, type FormValues } from "./SignInForm.schema";

export function SignInForm(): JSX.Element {
  const { t } = useTranslation("account");
  const login = useLogin();
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
      await login.mutateAsync(values);
    } catch {
      setError("root", { message: t("signIn.failed") });
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full" maxW="360px">
      <VStack gap={4} align="stretch">
        <Heading size="lg" color="white" fontWeight="800">
          {t("signIn.title")}
        </Heading>

        <FormField
          name="email"
          label={t("fields.email")}
          error={errors.email && t("validation.email")}
        >
          <Input id="email" type="email" placeholder={t("fields.email")} {...register("email")} />
        </FormField>

        <FormField
          name="password"
          label={t("fields.password")}
          error={errors.password && t("validation.password")}
        >
          <Input
            id="password"
            type="password"
            placeholder={t("fields.password")}
            {...register("password")}
          />
        </FormField>

        {errors.root && (
          <Text color="red.400" fontSize="sm" data-testid="sign-in-error">
            {errors.root.message}
          </Text>
        )}

        <Button type="submit" colorPalette="blue" size="lg" fontWeight="700" loading={isSubmitting}>
          {t("signIn.submit")}
        </Button>

        <Flex justify="center">
          <Link to="/$locale/forgot-password" params={{ locale }}>
            <Text fontSize="sm" color="gray.400" _hover={{ color: "white" }}>
              {t("signIn.forgotPassword")}
            </Text>
          </Link>
        </Flex>
      </VStack>
    </Box>
  );
}
