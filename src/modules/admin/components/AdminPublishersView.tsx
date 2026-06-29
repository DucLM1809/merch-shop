import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Button, Flex, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";

import { usePublishers } from "@/modules/catalog";
import { FormField } from "@/components/FormField";

import { useCreatePublisher, useDeletePublisher, useUpdatePublisher } from "../hooks";
import { schema, DEFAULTS } from "./AdminPublishersView.schema";

import type { CreatePublisherDto, Publisher } from "@/api/types";
import type { FormValues } from "./AdminPublishersView.schema";

export function AdminPublishersView(): React.JSX.Element {
  const { data: publishers = [], isLoading, error } = usePublishers();
  const create = useCreatePublisher();
  const update = useUpdatePublisher();
  const del = useDeletePublisher();

  const [mode, setMode] = useState<"idle" | "create" | { edit: Publisher }>("idle");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });

  function openCreate() {
    setMode("create");
    reset(DEFAULTS);
  }

  function openEdit(pub: Publisher) {
    setMode({ edit: pub });
    reset({ name: pub.name, slug: pub.slug, logoUrl: pub.logoUrl ?? "" });
    setConfirmDelete(null);
  }

  function cancel() {
    setMode("idle");
    reset(DEFAULTS);
  }

  async function onSubmit(data: FormValues) {
    const dto: CreatePublisherDto = {
      name: data.name.trim(),
      slug: data.slug.trim(),
      ...(data.logoUrl.trim() && { logoUrl: data.logoUrl.trim() }),
    };
    try {
      if (typeof mode === "object") {
        await update.mutateAsync({ id: mode.edit.id, body: dto });
      } else {
        await create.mutateAsync(dto);
      }
      cancel();
    } catch {
      setError("root", { message: "Save failed. Please try again." });
    }
  }

  return (
    <Box p={8}>
      <HStack mb={6} justify="space-between">
        <Heading size="lg" color="white">
          Publishers
        </Heading>

        {mode === "idle" && (
          <Button size="sm" colorPalette="blue" onClick={openCreate}>
            + New Publisher
          </Button>
        )}
      </HStack>

      {mode !== "idle" && (
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          mb={6}
          p={5}
          bg="gray.900"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.700"
        >
          <Text
            fontSize="xs"
            fontWeight="700"
            color="gray.500"
            textTransform="uppercase"
            letterSpacing="0.08em"
            mb={4}
          >
            {typeof mode === "object" ? "Edit Publisher" : "New Publisher"}
          </Text>

          <VStack gap={3} align="stretch">
            <FormField name="name" label="Name" error={errors.name}>
              <Input
                id="name"
                placeholder="Name"
                {...register("name")}
                bg="gray.800"
                borderColor="gray.700"
                color="white"
              />
            </FormField>

            <FormField name="slug" label="Slug" error={errors.slug}>
              <Input
                id="slug"
                placeholder="Slug (e.g. riot-games)"
                {...register("slug")}
                bg="gray.800"
                borderColor="gray.700"
                color="white"
              />
            </FormField>

            <FormField name="logoUrl" label="Logo URL" error={errors.logoUrl}>
              <Input
                id="logoUrl"
                placeholder="Logo URL (optional)"
                {...register("logoUrl")}
                bg="gray.800"
                borderColor="gray.700"
                color="white"
              />
            </FormField>

            {errors.root && (
              <Text color="red.400" fontSize="sm">
                {errors.root.message}
              </Text>
            )}

            <HStack justify="flex-end">
              <Button size="sm" variant="ghost" color="gray.400" type="button" onClick={cancel}>
                Cancel
              </Button>
              <Button size="sm" colorPalette="blue" type="submit" loading={isSubmitting}>
                Save
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

      {isLoading && <Text color="gray.500">Loading…</Text>}
      {error && <Text color="red.400">Failed to load publishers.</Text>}

      {!isLoading && !error && publishers.length === 0 && (
        <Text color="gray.400">No publishers yet.</Text>
      )}

      {!isLoading && !error && publishers.length > 0 && (
        <Box border="1px solid" borderColor="gray.800" borderRadius="lg" overflow="hidden">
          <Flex px={4} py={3} bg="gray.900" borderBottom="1px solid" borderColor="gray.800">
            <Text
              flex={1.5}
              fontSize="xs"
              fontWeight="700"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="0.08em"
            >
              Name
            </Text>
            <Text
              flex={1.5}
              fontSize="xs"
              fontWeight="700"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="0.08em"
            >
              Slug
            </Text>
            <Text
              flex={2}
              fontSize="xs"
              fontWeight="700"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="0.08em"
            >
              Logo
            </Text>
            <Box w="160px" />
          </Flex>

          {publishers.map((pub, i) => {
            const handleEdit = () => openEdit(pub);
            const handleDeleteStart = () => setConfirmDelete(pub.id);
            const handleDeleteCancel = () => setConfirmDelete(null);
            const handleDeleteConfirm = () =>
              void del.mutateAsync(pub.id).then(() => setConfirmDelete(null));
            return (
              <Flex
                key={pub.id}
                px={4}
                py={3.5}
                align="center"
                borderBottom={i < publishers.length - 1 ? "1px solid" : "none"}
                borderColor="gray.800"
              >
                <Text flex={1.5} fontSize="sm" color="white" fontWeight="600">
                  {pub.name}
                </Text>
                <Text flex={1.5} fontSize="sm" color="gray.400" fontFamily="mono">
                  {pub.slug}
                </Text>
                <Text
                  flex={2}
                  fontSize="xs"
                  color={pub.logoUrl ? "gray.500" : "gray.700"}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {pub.logoUrl ?? "—"}
                </Text>

                <HStack w="160px" justify="flex-end" gap={1}>
                  <Button
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: "white" }}
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>

                  {confirmDelete === pub.id ? (
                    <HStack gap={1}>
                      <Button
                        size="xs"
                        colorPalette="red"
                        loading={del.isPending}
                        onClick={handleDeleteConfirm}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        color="gray.500"
                        onClick={handleDeleteCancel}
                      >
                        ✕
                      </Button>
                    </HStack>
                  ) : (
                    <Button
                      size="xs"
                      variant="ghost"
                      color="gray.600"
                      _hover={{ color: "red.400" }}
                      onClick={handleDeleteStart}
                    >
                      Delete
                    </Button>
                  )}
                </HStack>
              </Flex>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
