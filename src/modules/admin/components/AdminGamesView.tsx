import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Button, Heading, HStack, Input, NativeSelect, Text, VStack } from "@chakra-ui/react";
import { Gamepad2 } from "lucide-react";

import { useGames, usePublishers } from "@/modules/catalog";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";

import { useCreateGame, useDeleteGame, useUpdateGame } from "../hooks";
import { AdminTable, AdminTableCell, AdminTableRow, type AdminColumn } from "./AdminTable";
import { schema, DEFAULTS } from "./AdminGamesView.schema";

import type { CreateGameDto, Game } from "@/api/types";
import type { FormValues } from "./AdminGamesView.schema";

const COLUMNS: AdminColumn[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "publisher", label: "Publisher" },
];

export function AdminGamesView(): React.JSX.Element {
  const { data: games = [], isLoading, error } = useGames();
  const { data: publishers = [] } = usePublishers();
  const create = useCreateGame();
  const update = useUpdateGame();
  const del = useDeleteGame();

  const [mode, setMode] = useState<"idle" | "create" | { edit: Game }>("idle");
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

  function openEdit(game: Game) {
    setMode({ edit: game });
    reset({ name: game.name, slug: game.slug, publisherId: game.publisherId });
    setConfirmDelete(null);
  }

  function cancel() {
    setMode("idle");
    reset(DEFAULTS);
  }

  async function onSubmit(data: FormValues) {
    const dto: CreateGameDto = {
      name: data.name.trim(),
      slug: data.slug.trim(),
      publisherId: data.publisherId,
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
    <PageContainer size="lg" py={8}>
      <HStack mb={6} justify="space-between">
        <Heading textStyle="h1" color="fg">
          Games
        </Heading>

        {mode === "idle" && (
          <Button size="sm" colorPalette="blue" onClick={openCreate}>
            + New Game
          </Button>
        )}
      </HStack>

      {mode !== "idle" && (
        <Card mb={6} p={5}>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Text
              fontSize="xs"
              fontWeight="700"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="0.08em"
              mb={4}
            >
              {typeof mode === "object" ? "Edit Game" : "New Game"}
            </Text>

            <VStack gap={3} align="stretch">
              <FormField name="name" label="Name" error={errors.name}>
                <Input id="name" placeholder="Name" {...register("name")} />
              </FormField>

              <FormField name="slug" label="Slug" error={errors.slug}>
                <Input
                  id="slug"
                  placeholder="Slug (e.g. league-of-legends)"
                  {...register("slug")}
                />
              </FormField>

              <FormField name="publisherId" label="Publisher" error={errors.publisherId}>
                <NativeSelect.Root>
                  <NativeSelect.Field id="publisherId" {...register("publisherId")}>
                    <option value="">Publisher…</option>
                    {publishers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </FormField>

              {errors.root && (
                <Text color="danger.fg" fontSize="sm">
                  {errors.root.message}
                </Text>
              )}

              <HStack justify="flex-end">
                <Button size="sm" variant="ghost" color="fg.muted" type="button" onClick={cancel}>
                  Cancel
                </Button>
                <Button size="sm" colorPalette="blue" type="submit" loading={isSubmitting}>
                  Save
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Card>
      )}

      {isLoading && <Text color="fg.muted">Loading…</Text>}
      {error && <Text color="danger.fg">Failed to load games.</Text>}

      {!isLoading && !error && games.length === 0 && (
        <EmptyState title="No games yet." icon={<Gamepad2 size={28} strokeWidth={1.5} />} />
      )}

      {!isLoading && !error && games.length > 0 && (
        <AdminTable columns={COLUMNS} hasActionsColumn>
          {games.map((game) => {
            const pub = publishers.find((p) => p.id === game.publisherId);
            const handleEdit = () => openEdit(game);
            const handleDeleteStart = () => setConfirmDelete(game.id);
            const handleDeleteCancel = () => setConfirmDelete(null);
            const handleDeleteConfirm = () =>
              void del.mutateAsync(game.id).then(() => setConfirmDelete(null));
            return (
              <AdminTableRow key={game.id} data-testid={`game-row-${game.id}`}>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg" fontWeight="600">
                    {game.name}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted" fontFamily="mono">
                    {game.slug}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted">
                    {pub?.name ?? game.publisherId}
                  </Text>
                </AdminTableCell>
                <AdminTableCell align="right">
                  <HStack justify="flex-end" gap={1}>
                    <Button size="xs" variant="ghost" color="fg.muted" onClick={handleEdit}>
                      Edit
                    </Button>

                    {confirmDelete === game.id ? (
                      <HStack gap={1}>
                        <Button
                          size="xs"
                          colorPalette="danger"
                          loading={del.isPending}
                          onClick={handleDeleteConfirm}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          color="fg.subtle"
                          onClick={handleDeleteCancel}
                        >
                          ✕
                        </Button>
                      </HStack>
                    ) : (
                      <Button
                        size="xs"
                        variant="ghost"
                        colorPalette="danger"
                        onClick={handleDeleteStart}
                      >
                        Delete
                      </Button>
                    )}
                  </HStack>
                </AdminTableCell>
              </AdminTableRow>
            );
          })}
        </AdminTable>
      )}
    </PageContainer>
  );
}
