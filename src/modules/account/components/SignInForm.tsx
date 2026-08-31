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
        <Heading as="h1" textStyle="h1" color="fg">
          {t("signIn.title")}
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
          error={errors.password && t("validation.password")}
          required
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
            <Text fontSize="sm" color="fg.muted" _hover={{ color: "fg" }}>
              {t("signIn.forgotPassword")}
            </Text>
          </Link>
        </Flex>

        {/* The page hides the global nav, so without this the only route to registration
            from a sign-in page is the browser's back button. Underline rather than a color
            marks the link: `fg` on `bg` is the one pairing that clears AA in both modes. */}
        <Flex justify="center" pt={2} borderTopWidth="1px" borderColor="border.muted">
          <Text fontSize="sm" color="fg.muted">
            {t("signIn.noAccount")}{" "}
            <Link to="/$locale/sign-up" params={{ locale }}>
              <Text
                as="span"
                color="fg"
                fontWeight="600"
                textDecoration="underline"
                textUnderlineOffset="3px"
              >
                {t("signIn.signUpLink")}
              </Text>
            </Link>
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
}
