import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Button, Heading, HStack, Input, NativeSelect, Text, VStack } from "@chakra-ui/react";
import { Users } from "lucide-react";

import { useGames, useTeams } from "@/modules/catalog";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";

import { useCreateTeam, useDeleteTeam, useUpdateTeam } from "../hooks";
import { AdminFormSheet } from "./AdminFormSheet";
import {
  AdminRowActions,
  AdminTable,
  AdminTableCell,
  AdminTableRow,
  type AdminColumn,
} from "./AdminTable";
import { schema, DEFAULTS } from "./AdminTeamsView.schema";

import type { CreateTeamDto, Team } from "@/api/types";
import type { FormValues } from "./AdminTeamsView.schema";

const COLUMNS: AdminColumn[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "game", label: "Game" },
];

export function AdminTeamsView(): React.JSX.Element {
  const { data: teams = [], isLoading, error } = useTeams();
  const { data: games = [] } = useGames();
  const create = useCreateTeam();
  const update = useUpdateTeam();
  const del = useDeleteTeam();

  const [mode, setMode] = useState<"idle" | "create" | { edit: Team }>("idle");
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

  function openEdit(team: Team) {
    setMode({ edit: team });
    reset({ name: team.name, slug: team.slug, gameId: team.gameId });
    setConfirmDelete(null);
  }

  function cancel() {
    setMode("idle");
    reset(DEFAULTS);
  }

  async function onSubmit(data: FormValues) {
    const dto: CreateTeamDto = {
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
    <PageContainer size="lg" py={8}>
      <HStack mb={6} justify="space-between">
        <Heading textStyle="h1" color="fg">
          Teams
        </Heading>

        {mode === "idle" && (
          <Button size="sm" colorPalette="blue" onClick={openCreate}>
            + New Team
          </Button>
        )}
      </HStack>

      {mode !== "idle" && (
        <AdminFormSheet
          open
          onOpenChange={cancel}
          title={typeof mode === "object" ? "Edit Team" : "New Team"}
        >
          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            flex="1"
            minH={0}
            overflow="auto"
          >
            <VStack gap={3} align="stretch" maxW="xl" w="full" mx="auto" p={6}>
              <FormField name="name" label="Name" error={errors.name}>
                <Input id="name" placeholder="Name" {...register("name")} />
              </FormField>

              <FormField name="slug" label="Slug" error={errors.slug}>
                <Input id="slug" placeholder="Slug (e.g. cloud9)" {...register("slug")} />
              </FormField>

              <FormField name="gameId" label="Game" error={errors.gameId}>
                <NativeSelect.Root>
                  <NativeSelect.Field id="gameId" {...register("gameId")}>
                    <option value="">Game…</option>
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
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

              <HStack justify="flex-end" pt={2}>
                <Button size="sm" variant="ghost" color="fg.muted" type="button" onClick={cancel}>
                  Cancel
                </Button>
                <Button size="sm" colorPalette="blue" type="submit" loading={isSubmitting}>
                  Save
                </Button>
              </HStack>
            </VStack>
          </Box>
        </AdminFormSheet>
      )}

      {isLoading && <Text color="fg.muted">Loading…</Text>}
      {error && <Text color="danger.fg">Failed to load teams.</Text>}

      {!isLoading && !error && teams.length === 0 && (
        <EmptyState title="No teams yet." icon={<Users size={28} strokeWidth={1.5} />} />
      )}

      {!isLoading && !error && teams.length > 0 && (
        <AdminTable columns={COLUMNS} hasActionsColumn>
          {teams.map((team) => {
            const game = games.find((g) => g.id === team.gameId);
            const handleEdit = () => openEdit(team);
            const handleDeleteStart = () => setConfirmDelete(team.id);
            const handleDeleteCancel = () => setConfirmDelete(null);
            const handleDeleteConfirm = () =>
              void del.mutateAsync(team.id).then(() => setConfirmDelete(null));
            return (
              <AdminTableRow key={team.id} data-testid={`team-row-${team.id}`}>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg" fontWeight="600">
                    {team.name}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted" fontFamily="mono">
                    {team.slug}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted">
                    {game?.name ?? team.gameId}
                  </Text>
                </AdminTableCell>
                <AdminTableCell align="right">
                  <AdminRowActions
                    onEdit={handleEdit}
                    onDeleteStart={handleDeleteStart}
                    onDeleteCancel={handleDeleteCancel}
                    onDeleteConfirm={handleDeleteConfirm}
                    confirming={confirmDelete === team.id}
                    deleting={del.isPending}
                  />
                </AdminTableCell>
              </AdminTableRow>
            );
          })}
        </AdminTable>
      )}
    </PageContainer>
  );
}
