import type { JSX } from "react";

import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/FormField";
import { useLogin } from "../hooks";
import { schema, DEFAULTS, type FormValues } from "./SignInForm.schema";

export function SignInForm(): JSX.Element {
  const login = useLogin();
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
      setError("root", { message: "Invalid email or password" });
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full" maxW="360px">
      <VStack gap={4} align="stretch">
        <Heading size="lg" color="white" fontWeight="800">
          Sign in
        </Heading>

        <FormField name="email" label="Email" error={errors.email}>
          <Input id="email" type="email" placeholder="Email" {...register("email")} />
        </FormField>

        <FormField name="password" label="Password" error={errors.password}>
          <Input id="password" type="password" placeholder="Password" {...register("password")} />
        </FormField>

        {errors.root && (
          <Text color="red.400" fontSize="sm" data-testid="sign-in-error">
            {errors.root.message}
          </Text>
        )}

        <Button type="submit" colorPalette="blue" size="lg" fontWeight="700" loading={isSubmitting}>
          Sign in
        </Button>

        <Flex justify="center">
          <Link to="/forgot-password">
            <Text fontSize="sm" color="gray.400" _hover={{ color: "white" }}>
              Forgot password?
            </Text>
          </Link>
        </Flex>
      </VStack>
    </Box>
  );
}
