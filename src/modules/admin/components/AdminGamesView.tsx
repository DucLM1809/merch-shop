import { useState } from "react";

import { Box, Button, Flex, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";

import { useGames, usePublishers } from "@/modules/catalog";

import { useCreateGame, useDeleteGame, useUpdateGame } from "../hooks";

import type { CreateGameDto, Game } from "@/api/types";

type FormState = { name: string; slug: string; publisherId: string };

const EMPTY: FormState = { name: "", slug: "", publisherId: "" };

export function AdminGamesView(): React.JSX.Element {
  const { data: games = [], isLoading, error } = useGames();
  const { data: publishers = [] } = usePublishers();
  const create = useCreateGame();
  const update = useUpdateGame();
  const del = useDeleteGame();

  const [mode, setMode] = useState<"idle" | "create" | { edit: Game }>("idle");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function openCreate() {
    setMode("create");
    setForm(EMPTY);
  }

  function openEdit(game: Game) {
    setMode({ edit: game });
    setForm({ name: game.name, slug: game.slug, publisherId: game.publisherId });
    setConfirmDelete(null);
  }

  function cancel() {
    setMode("idle");
    setForm(EMPTY);
  }

  async function submit() {
    const dto: CreateGameDto = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      publisherId: form.publisherId,
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
          Games
        </Heading>

        {mode === "idle" && (
          <Button size="sm" colorPalette="blue" onClick={openCreate}>
            + New Game
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
            {typeof mode === "object" ? "Edit Game" : "New Game"}
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
              placeholder="Slug (e.g. league-of-legends)"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />
            <Box
              as="select"
              value={form.publisherId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm((f) => ({ ...f, publisherId: e.target.value }))
              }
              bg="gray.800"
              border="1px solid"
              borderColor="gray.700"
              borderRadius="md"
              color={form.publisherId ? "white" : "gray.500"}
              px={3}
              py={2}
              fontSize="sm"
            >
              <option value="">Publisher…</option>
              {publishers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Box>

            <HStack justify="flex-end">
              <Button size="sm" variant="ghost" color="gray.400" onClick={cancel}>
                Cancel
              </Button>
              <Button
                size="sm"
                colorPalette="blue"
                onClick={() => void submit()}
                loading={isPending}
                disabled={!form.name.trim() || !form.slug.trim() || !form.publisherId}
              >
                Save
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

      {isLoading && <Text color="gray.500">Loading…</Text>}
      {error && <Text color="red.400">Failed to load games.</Text>}

      {!isLoading && !error && games.length === 0 && <Text color="gray.400">No games yet.</Text>}

      {!isLoading && !error && games.length > 0 && (
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
              flex={1}
              fontSize="xs"
              fontWeight="700"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="0.08em"
            >
              Publisher
            </Text>
            <Box w="160px" />
          </Flex>

          {games.map((game, i) => {
            const pub = publishers.find((p) => p.id === game.publisherId);
            return (
              <Flex
                key={game.id}
                px={4}
                py={3.5}
                align="center"
                borderBottom={i < games.length - 1 ? "1px solid" : "none"}
                borderColor="gray.800"
              >
                <Text flex={1.5} fontSize="sm" color="white" fontWeight="600">
                  {game.name}
                </Text>
                <Text flex={1.5} fontSize="sm" color="gray.400" fontFamily="mono">
                  {game.slug}
                </Text>
                <Text flex={1} fontSize="sm" color="gray.400">
                  {pub?.name ?? game.publisherId}
                </Text>

                <HStack w="160px" justify="flex-end" gap={1}>
                  <Button
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: "white" }}
                    onClick={() => openEdit(game)}
                  >
                    Edit
                  </Button>

                  {confirmDelete === game.id ? (
                    <HStack gap={1}>
                      <Button
                        size="xs"
                        colorPalette="red"
                        loading={del.isPending}
                        onClick={() =>
                          void del.mutateAsync(game.id).then(() => setConfirmDelete(null))
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
                      onClick={() => setConfirmDelete(game.id)}
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
