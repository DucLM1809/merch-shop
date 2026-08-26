import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Button, Heading, HStack, Input, NativeSelect, Text, VStack } from "@chakra-ui/react";
import { Package } from "lucide-react";

import { useCharacters, useGames, useProducts, usePublishers, useTeams } from "@/modules/catalog";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";

import { useCreateProduct, useDeleteProduct, useUpdateProduct } from "../hooks";
import { AdminTable, AdminTableCell, AdminTableRow, type AdminColumn } from "./AdminTable";
import { schema, DEFAULTS } from "./AdminProductsView.schema";

import type { CreateProductDto, Product } from "@/api/types";
import type { FormValues } from "./AdminProductsView.schema";

const COLUMNS: AdminColumn[] = [
  { key: "name", label: "Name" },
  { key: "id", label: "ID" },
  { key: "price", label: "Price" },
  { key: "publisher", label: "Publisher" },
  { key: "game", label: "Game" },
];

export function AdminProductsView(): React.JSX.Element {
  const { data: products = [], isLoading, error } = useProducts();
  const { data: publishers = [] } = usePublishers();
  const { data: games = [] } = useGames();
  const { data: teams = [] } = useTeams();
  const { data: characters = [] } = useCharacters();

  const create = useCreateProduct();
  const update = useUpdateProduct();
  const del = useDeleteProduct();

  const [mode, setMode] = useState<"idle" | "create" | { edit: Product }>("idle");
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

  function openEdit(product: Product) {
    setMode({ edit: product });
    reset({
      name: product.name,
      description: product.description ?? "",
      imageUrl: product.imageUrl ?? "",
      gameId: product.gameId,
      teamId: product.teamId ?? "",
      characterId: product.characterId ?? "",
    });
    setConfirmDelete(null);
  }

  function cancel() {
    setMode("idle");
    reset(DEFAULTS);
  }

  async function onSubmit(data: FormValues) {
    const dto: CreateProductDto = {
      name: data.name.trim(),
      gameId: data.gameId,
      ...(data.description.trim() && { description: data.description.trim() }),
      ...(data.imageUrl.trim() && { images: [data.imageUrl.trim()] }),
      ...(data.teamId && { teamId: data.teamId }),
      ...(data.characterId && { characterId: data.characterId }),
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
          Products
        </Heading>

        {mode === "idle" && (
          <Button size="sm" colorPalette="blue" onClick={openCreate}>
            + New Product
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
              {typeof mode === "object" ? "Edit Product" : "New Product"}
            </Text>

            <VStack gap={3} align="stretch">
              <FormField name="name" label="Name" error={errors.name}>
                <Input id="name" placeholder="Name" {...register("name")} />
              </FormField>

              <FormField name="description" label="Description" error={errors.description}>
                <Input
                  id="description"
                  placeholder="Description (optional)"
                  {...register("description")}
                />
              </FormField>

              <FormField name="imageUrl" label="Image URL" error={errors.imageUrl}>
                <Input id="imageUrl" placeholder="Image URL (optional)" {...register("imageUrl")} />
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

              <NativeSelect.Root>
                <NativeSelect.Field {...register("teamId")}>
                  <option value="">Team (optional)…</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>

              <NativeSelect.Root>
                <NativeSelect.Field {...register("characterId")}>
                  <option value="">Character (optional)…</option>
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>

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
      {error && <Text color="danger.fg">Failed to load products.</Text>}

      {!isLoading && !error && products.length === 0 && (
        <EmptyState title="No products yet." icon={<Package size={28} strokeWidth={1.5} />} />
      )}

      {!isLoading && !error && products.length > 0 && (
        <AdminTable columns={COLUMNS} hasActionsColumn>
          {products.map((product) => {
            const publisher = publishers.find((p) => p.id === product.publisherId);
            const game = games.find((g) => g.id === product.gameId);
            const handleEdit = () => openEdit(product);
            const handleDeleteStart = () => setConfirmDelete(product.id);
            const handleDeleteCancel = () => setConfirmDelete(null);
            const handleDeleteConfirm = () =>
              void del.mutateAsync(product.id).then(() => setConfirmDelete(null));
            return (
              <AdminTableRow key={product.id} data-testid={`product-row-${product.id}`}>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg" fontWeight="600">
                    {product.name}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted" fontFamily="mono">
                    {product.id}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted">
                    ${product.price.toFixed(2)}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted">
                    {publisher?.name ?? product.publisherId}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted">
                    {game?.name ?? product.gameId}
                  </Text>
                </AdminTableCell>
                <AdminTableCell align="right">
                  <HStack justify="flex-end" gap={1}>
                    <Button size="xs" variant="ghost" color="fg.muted" onClick={handleEdit}>
                      Edit
                    </Button>

                    {confirmDelete === product.id ? (
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
