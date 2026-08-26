import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Button, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { TrendingUp } from "lucide-react";

import { usePublishers } from "@/modules/catalog";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";

import { useCreatePublisher, useDeletePublisher, useUpdatePublisher } from "../hooks";
import { AdminFormSheet } from "./AdminFormSheet";
import {
  AdminRowActions,
  AdminTable,
  AdminTableCell,
  AdminTableRow,
  type AdminColumn,
} from "./AdminTable";
import { schema, DEFAULTS } from "./AdminPublishersView.schema";

import type { CreatePublisherDto, Publisher } from "@/api/types";
import type { FormValues } from "./AdminPublishersView.schema";

const COLUMNS: AdminColumn[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "logo", label: "Logo" },
];

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
    <PageContainer size="lg" py={8}>
      <HStack mb={6} justify="space-between">
        <Heading textStyle="h1" color="fg">
          Publishers
        </Heading>

        {mode === "idle" && (
          <Button size="sm" colorPalette="blue" onClick={openCreate}>
            + New Publisher
          </Button>
        )}
      </HStack>

      {mode !== "idle" && (
        <AdminFormSheet
          open
          onOpenChange={cancel}
          title={typeof mode === "object" ? "Edit Publisher" : "New Publisher"}
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
              <FormField name="name" label="Name" error={errors.name} required>
                <Input id="name" placeholder="Name" {...register("name")} />
              </FormField>

              <FormField name="slug" label="Slug" error={errors.slug} required>
                <Input id="slug" placeholder="Slug (e.g. riot-games)" {...register("slug")} />
              </FormField>

              <FormField name="logoUrl" label="Logo URL" error={errors.logoUrl}>
                <Input id="logoUrl" placeholder="Logo URL (optional)" {...register("logoUrl")} />
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
      {error && <Text color="danger.fg">Failed to load publishers.</Text>}

      {!isLoading && !error && publishers.length === 0 && (
        <EmptyState title="No publishers yet." icon={<TrendingUp size={28} strokeWidth={1.5} />} />
      )}

      {!isLoading && !error && publishers.length > 0 && (
        <AdminTable columns={COLUMNS} hasActionsColumn>
          {publishers.map((pub) => {
            const handleEdit = () => openEdit(pub);
            const handleDeleteStart = () => setConfirmDelete(pub.id);
            const handleDeleteCancel = () => setConfirmDelete(null);
            const handleDeleteConfirm = () =>
              void del.mutateAsync(pub.id).then(() => setConfirmDelete(null));
            return (
              <AdminTableRow key={pub.id} data-testid={`publisher-row-${pub.id}`}>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg" fontWeight="600">
                    {pub.name}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted" fontFamily="mono">
                    {pub.slug}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text
                    fontSize="xs"
                    color={pub.logoUrl ? "fg.muted" : "fg.subtle"}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {pub.logoUrl ?? "—"}
                  </Text>
                </AdminTableCell>
                <AdminTableCell align="right">
                  <AdminRowActions
                    onEdit={handleEdit}
                    onDeleteStart={handleDeleteStart}
                    onDeleteCancel={handleDeleteCancel}
                    onDeleteConfirm={handleDeleteConfirm}
                    confirming={confirmDelete === pub.id}
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
