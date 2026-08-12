import type { JSX } from "react";

import { Box, Button, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/FormField";
import { useForgotPassword } from "../hooks";
import { schema, DEFAULTS, type FormValues } from "./ForgotPasswordForm.schema";

export function ForgotPasswordForm(): JSX.Element {
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
        <Heading size="lg" color="white" fontWeight="800" mb={3}>
          Check your email
        </Heading>
        <Text color="gray.400" data-testid="forgot-password-success">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </Text>
      </Box>
    );
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full" maxW="360px">
      <VStack gap={4} align="stretch">
        <Heading size="lg" color="white" fontWeight="800">
          Forgot password
        </Heading>

        <FormField name="email" label="Email" error={errors.email}>
          <Input id="email" type="email" placeholder="Email" {...register("email")} />
        </FormField>

        <Button type="submit" colorPalette="blue" size="lg" fontWeight="700" loading={isSubmitting}>
          Send reset link
        </Button>
      </VStack>
    </Box>
  );
}
