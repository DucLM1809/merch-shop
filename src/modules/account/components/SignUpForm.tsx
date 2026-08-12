import type { JSX } from "react";

import { Box, Button, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/FormField";
import { useRegister } from "../hooks";
import { schema, DEFAULTS, type FormValues } from "./SignUpForm.schema";

export function SignUpForm(): JSX.Element {
  const register_ = useRegister();
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
      setError("root", { message: "Could not create account. The email may already be in use." });
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full" maxW="360px">
      <VStack gap={4} align="stretch">
        <Heading size="lg" color="white" fontWeight="800">
          Sign up
        </Heading>

        <FormField name="email" label="Email" error={errors.email}>
          <Input id="email" type="email" placeholder="Email" {...register("email")} />
        </FormField>

        <FormField name="password" label="Password" error={errors.password}>
          <Input
            id="password"
            type="password"
            placeholder="Password (min. 12 characters)"
            {...register("password")}
          />
        </FormField>

        {errors.root && (
          <Text color="red.400" fontSize="sm" data-testid="sign-up-error">
            {errors.root.message}
          </Text>
        )}

        <Button type="submit" colorPalette="blue" size="lg" fontWeight="700" loading={isSubmitting}>
          Sign up
        </Button>
      </VStack>
    </Box>
  );
}
