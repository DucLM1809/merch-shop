import { useState } from "react";

import { Box, Button, Flex, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";

import { usePublishers } from "@/modules/catalog";

import { useCreatePublisher, useDeletePublisher, useUpdatePublisher } from "../hooks";

import type { CreatePublisherDto, Publisher } from "@/api/types";

type FormState = { name: string; slug: string; logoUrl: string };

const EMPTY: FormState = { name: "", slug: "", logoUrl: "" };

export function AdminPublishersView(): React.JSX.Element {
  const { data: publishers = [], isLoading, error } = usePublishers();
  const create = useCreatePublisher();
  const update = useUpdatePublisher();
  const del = useDeletePublisher();

  const [mode, setMode] = useState<"idle" | "create" | { edit: Publisher }>("idle");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function openCreate() {
    setMode("create");
    setForm(EMPTY);
  }

  function openEdit(pub: Publisher) {
    setMode({ edit: pub });
    setForm({ name: pub.name, slug: pub.slug, logoUrl: pub.logoUrl ?? "" });
    setConfirmDelete(null);
  }

  function cancel() {
    setMode("idle");
    setForm(EMPTY);
  }

  async function submit() {
    const dto: CreatePublisherDto = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      ...(form.logoUrl.trim() && { logoUrl: form.logoUrl.trim() }),
    };
    if (typeof mode === "object") {
      await update.mutateAsync({ id: mode.edit.id, body: dto });
    } else {
      await create.mutateAsync(dto);
    }
    cancel();
  }

  const isPending = create.isPending || update.isPending;

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
        <Box mb={6} p={5} bg="gray.900" borderRadius="lg" border="1px solid" borderColor="gray.700">
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
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />
            <Input
              placeholder="Slug (e.g. riot-games)"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />
            <Input
              placeholder="Logo URL (optional)"
              value={form.logoUrl}
              onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />

            <HStack justify="flex-end">
              <Button size="sm" variant="ghost" color="gray.400" onClick={cancel}>
                Cancel
              </Button>
              <Button
                size="sm"
                colorPalette="blue"
                onClick={() => void submit()}
                loading={isPending}
                disabled={!form.name.trim() || !form.slug.trim()}
              >
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

          {publishers.map((pub, i) => (
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
                  onClick={() => openEdit(pub)}
                >
                  Edit
                </Button>

                {confirmDelete === pub.id ? (
                  <HStack gap={1}>
                    <Button
                      size="xs"
                      colorPalette="red"
                      loading={del.isPending}
                      onClick={() =>
                        void del.mutateAsync(pub.id).then(() => setConfirmDelete(null))
                      }
                    >
                      Confirm
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      color="gray.500"
                      onClick={() => setConfirmDelete(null)}
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
                    onClick={() => setConfirmDelete(pub.id)}
                  >
                    Delete
                  </Button>
                )}
              </HStack>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
}
