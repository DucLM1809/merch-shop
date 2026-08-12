import type { JSX } from "react";

import { Box, Button, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/FormField";
import { useResetPassword } from "../hooks";
import { schema, DEFAULTS, type FormValues } from "./ResetPasswordForm.schema";

type Props = {
  token: string;
};

export function ResetPasswordForm({ token }: Props): JSX.Element {
  const resetPassword = useResetPassword();
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
      setError("root", { message: "This reset link is invalid or has expired." });
    }
  }

  if (resetPassword.isSuccess) {
    return (
      <Box w="full" maxW="360px" textAlign="center">
        <Heading size="lg" color="white" fontWeight="800" mb={3}>
          Password reset
        </Heading>
        <Text color="gray.400" mb={4} data-testid="reset-password-success">
          Your password has been reset. You can now sign in.
        </Text>
        <Link to="/sign-in">
          <Button colorPalette="blue">Go to sign in</Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full" maxW="360px">
      <VStack gap={4} align="stretch">
        <Heading size="lg" color="white" fontWeight="800">
          Reset password
        </Heading>

        <FormField name="newPassword" label="New password" error={errors.newPassword}>
          <Input
            id="newPassword"
            type="password"
            placeholder="New password (min. 12 characters)"
            {...register("newPassword")}
          />
        </FormField>

        {errors.root && (
          <Text color="red.400" fontSize="sm" data-testid="reset-password-error">
            {errors.root.message}
          </Text>
        )}

        <Button type="submit" colorPalette="blue" size="lg" fontWeight="700" loading={isSubmitting}>
          Reset password
        </Button>
      </VStack>
    </Box>
  );
}
