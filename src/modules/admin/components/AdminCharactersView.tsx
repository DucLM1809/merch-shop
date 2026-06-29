import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useCharacters, useGames } from "@/modules/catalog";
import { FormField } from "@/components/FormField";

import { useCreateCharacter, useDeleteCharacter, useUpdateCharacter } from "../hooks";
import { schema, DEFAULTS } from "./AdminCharactersView.schema";

import type { Character, CreateCharacterDto } from "@/api/types";
import type { FormValues } from "./AdminCharactersView.schema";

const selectStyle = {
  bg: "gray.800",
  border: "1px solid",
  borderColor: "gray.700",
  borderRadius: "md",
  color: "white",
  px: 3,
  py: 2,
  fontSize: "sm",
};

export function AdminCharactersView(): React.JSX.Element {
  const { data: characters = [], isLoading, error } = useCharacters();
  const { data: games = [] } = useGames();
  const create = useCreateCharacter();
  const update = useUpdateCharacter();
  const del = useDeleteCharacter();

  const [mode, setMode] = useState<"idle" | "create" | { edit: Character }>("idle");
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

  function openEdit(character: Character) {
    setMode({ edit: character });
    reset({ name: character.name, slug: character.slug, gameId: character.gameId });
    setConfirmDelete(null);
  }

  function cancel() {
    setMode("idle");
    reset(DEFAULTS);
  }

  async function onSubmit(data: FormValues) {
    const dto: CreateCharacterDto = {
      name: data.name.trim(),
      slug: data.slug.trim(),
      gameId: data.gameId,
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
          Characters
        </Heading>

        {mode === "idle" && (
          <Button size="sm" colorPalette="blue" onClick={openCreate}>
            + New Character
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
            {typeof mode === "object" ? "Edit Character" : "New Character"}
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
                placeholder="Slug (e.g. jinx)"
                {...register("slug")}
                bg="gray.800"
                borderColor="gray.700"
                color="white"
              />
            </FormField>

            <FormField name="gameId" label="Game" error={errors.gameId}>
              <NativeSelectRoot unstyled>
                <NativeSelectField id="gameId" {...register("gameId")} {...selectStyle}>
                  <option value="">Game…</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
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
      {error && <Text color="red.400">Failed to load characters.</Text>}

      {!isLoading && !error && characters.length === 0 && (
        <Text color="gray.400">No characters yet.</Text>
      )}

      {!isLoading && !error && characters.length > 0 && (
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

          {characters.map((character, i) => {
            const game = games.find((g) => g.id === character.gameId);
            const handleEdit = () => openEdit(character);
            const handleDeleteStart = () => setConfirmDelete(character.id);
            const handleDeleteCancel = () => setConfirmDelete(null);
            const handleDeleteConfirm = () =>
              void del.mutateAsync(character.id).then(() => setConfirmDelete(null));
            return (
              <Flex
                key={character.id}
                px={4}
                py={3.5}
                align="center"
                borderBottom={i < characters.length - 1 ? "1px solid" : "none"}
                borderColor="gray.800"
              >
                <Text flex={1.5} fontSize="sm" color="white" fontWeight="600">
                  {character.name}
                </Text>
                <Text flex={1.5} fontSize="sm" color="gray.400" fontFamily="mono">
                  {character.slug}
                </Text>
                <Text flex={1} fontSize="sm" color="gray.400">
                  {game?.name ?? character.gameId}
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

                  {confirmDelete === character.id ? (
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
