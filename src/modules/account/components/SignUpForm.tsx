import type { JSX } from "react";

import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormField } from "@/components/FormField";
import { useLocale } from "@/i18n/useLocale";
import { useRegister } from "../hooks";
import { PASSWORD_MIN_LENGTH } from "../passwordPolicy";
import { schema, DEFAULTS, type FormValues } from "./SignUpForm.schema";

export function SignUpForm(): JSX.Element {
  const { t } = useTranslation("account");
  const register_ = useRegister();
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
      await register_.mutateAsync(values);
    } catch {
      setError("root", { message: t("signUp.failed") });
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full" maxW="360px">
      <VStack gap={4} align="stretch">
        <Heading as="h1" textStyle="h1" color="fg">
          {t("signUp.title")}
        </Heading>

        <FormField
          name="email"
          label={t("fields.email")}
          error={errors.email && t("validation.email")}
          required
        >
          <Input id="email" type="email" placeholder={t("fields.email")} {...register("email")} />
        </FormField>

        <FormField
          name="password"
          label={t("fields.password")}
          error={errors.password && t("validation.passwordMin", { min: PASSWORD_MIN_LENGTH })}
          required
        >
          <Input
            id="password"
            type="password"
            placeholder={t("fields.passwordPlaceholder", { min: PASSWORD_MIN_LENGTH })}
            {...register("password")}
          />
        </FormField>

        {errors.root && (
          <Text color="red.400" fontSize="sm" data-testid="sign-up-error">
            {errors.root.message}
          </Text>
        )}

        <Button type="submit" colorPalette="blue" size="lg" fontWeight="700" loading={isSubmitting}>
          {t("signUp.submit")}
        </Button>

        {/* Mirror of the sign-up link on `SignInForm` — see the note there on why the link is
            underlined rather than colored. */}
        <Flex justify="center" pt={2} borderTopWidth="1px" borderColor="border.muted">
          <Text fontSize="sm" color="fg.muted">
            {t("signUp.haveAccount")}{" "}
            <Link to="/$locale/sign-in" params={{ locale }}>
              <Text
                as="span"
                color="fg"
                fontWeight="600"
                textDecoration="underline"
                textUnderlineOffset="3px"
              >
                {t("signUp.signInLink")}
              </Text>
            </Link>
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
}
