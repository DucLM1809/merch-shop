import { useState } from "react";

import { Box, Button, Flex, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";

import { useGames, useTeams } from "@/modules/catalog";

import { useCreateTeam, useDeleteTeam, useUpdateTeam } from "../hooks";

import type { CreateTeamDto, Team } from "@/api/types";

type FormState = { name: string; slug: string; gameId: string };

const EMPTY: FormState = { name: "", slug: "", gameId: "" };

export function AdminTeamsView(): React.JSX.Element {
  const { data: teams = [], isLoading, error } = useTeams();
  const { data: games = [] } = useGames();
  const create = useCreateTeam();
  const update = useUpdateTeam();
  const del = useDeleteTeam();

  const [mode, setMode] = useState<"idle" | "create" | { edit: Team }>("idle");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function openCreate() {
    setMode("create");
    setForm(EMPTY);
  }

  function openEdit(team: Team) {
    setMode({ edit: team });
    setForm({ name: team.name, slug: team.slug, gameId: team.gameId });
    setConfirmDelete(null);
  }

  function cancel() {
    setMode("idle");
    setForm(EMPTY);
  }

  async function submit() {
    const dto: CreateTeamDto = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      gameId: form.gameId,
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
          Teams
        </Heading>

        {mode === "idle" && (
          <Button size="sm" colorPalette="blue" onClick={openCreate}>
            + New Team
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
            {typeof mode === "object" ? "Edit Team" : "New Team"}
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
              placeholder="Slug (e.g. cloud9)"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />
            <Box
              as="select"
              value={form.gameId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm((f) => ({ ...f, gameId: e.target.value }))
              }
              bg="gray.800"
              border="1px solid"
              borderColor="gray.700"
              borderRadius="md"
              color={form.gameId ? "white" : "gray.500"}
              px={3}
              py={2}
              fontSize="sm"
            >
              <option value="">Game…</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
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
                disabled={!form.name.trim() || !form.slug.trim() || !form.gameId}
              >
                Save
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

      {isLoading && <Text color="gray.500">Loading…</Text>}
      {error && <Text color="red.400">Failed to load teams.</Text>}

      {!isLoading && !error && teams.length === 0 && <Text color="gray.400">No teams yet.</Text>}

      {!isLoading && !error && teams.length > 0 && (
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
              Game
            </Text>
            <Box w="160px" />
          </Flex>

          {teams.map((team, i) => {
            const game = games.find((g) => g.id === team.gameId);
            return (
              <Flex
                key={team.id}
                px={4}
                py={3.5}
                align="center"
                borderBottom={i < teams.length - 1 ? "1px solid" : "none"}
                borderColor="gray.800"
              >
                <Text flex={1.5} fontSize="sm" color="white" fontWeight="600">
                  {team.name}
                </Text>
                <Text flex={1.5} fontSize="sm" color="gray.400" fontFamily="mono">
                  {team.slug}
                </Text>
                <Text flex={1} fontSize="sm" color="gray.400">
                  {game?.name ?? team.gameId}
                </Text>

                <HStack w="160px" justify="flex-end" gap={1}>
                  <Button
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: "white" }}
                    onClick={() => openEdit(team)}
                  >
                    Edit
                  </Button>

                  {confirmDelete === team.id ? (
                    <HStack gap={1}>
                      <Button
                        size="xs"
                        colorPalette="red"
                        loading={del.isPending}
                        onClick={() =>
                          void del.mutateAsync(team.id).then(() => setConfirmDelete(null))
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
                      onClick={() => setConfirmDelete(team.id)}
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
