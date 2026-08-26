import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Button, Heading, HStack, Input, NativeSelect, Text, VStack } from "@chakra-ui/react";
import { Tags } from "lucide-react";

import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";
import { useCharacters, useGames, useProducts, useTeams } from "@/modules/catalog";

import {
  useBulkSetSkuAvailability,
  useCreateSku,
  useDeleteSku,
  useSetSkuAvailability,
} from "../hooks";

import { AdminTable, AdminTableCell, AdminTableRow, type AdminColumn } from "./AdminTable";
import { schema, DEFAULTS } from "./AdminSkusView.schema";

import type { FormValues } from "./AdminSkusView.schema";
import type { CreateSkuDto, Product, SKU, SkuFacet } from "@/api/types";

type EnrichedSku = SKU & { productId: string; productName: string };

const COLUMNS: AdminColumn[] = [
  { key: "product", label: "Product" },
  { key: "price", label: "Price" },
  { key: "size", label: "Size" },
  { key: "color", label: "Color" },
  { key: "edition", label: "Edition" },
];

export function AdminSkusView(): React.JSX.Element {
  const { data: products = [], isLoading, error } = useProducts({ includeUnavailable: true });
  const create = useCreateSku();
  const toggle = useSetSkuAvailability();
  const del = useDeleteSku();
  const bulk = useBulkSetSkuAvailability();

  const { data: games = [] } = useGames();
  const { data: teams = [] } = useTeams();
  const { data: characters = [] } = useCharacters();

  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [bulkFacet, setBulkFacet] = useState<SkuFacet>("game");
  const [bulkFacetId, setBulkFacetId] = useState("");
  const [bulkAvailable, setBulkAvailable] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
    mode: "onTouched",
  });

  const allSkus: EnrichedSku[] = products.flatMap((p: Product) =>
    (p.skus ?? []).map((s) => ({ ...s, productId: p.id, productName: p.name }))
  );

  const handleShowForm = () => setShowForm(true);

  function cancel() {
    setShowForm(false);
    reset();
  }

  const bulkFacetOptions = bulkFacet === "game" ? games : bulkFacet === "team" ? teams : characters;

  function handleBulkFacetChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setBulkFacet(e.target.value as SkuFacet);
    setBulkFacetId("");
  }

  function handleBulkFacetIdChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setBulkFacetId(e.target.value);
  }

  function handleBulkAvailableChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setBulkAvailable(e.target.value === "true");
  }

  function handleApplyBulk() {
    if (!bulkFacetId) return;
    void bulk.mutateAsync({ facet: bulkFacet, facetId: bulkFacetId, available: bulkAvailable });
  }

  async function onSubmit(data: FormValues) {
    const attributes = {
      ...(data.size.trim() && { size: data.size.trim() }),
      ...(data.color.trim() && { color: data.color.trim() }),
      ...(data.edition.trim() && { edition: data.edition.trim() }),
    };
    const dto: CreateSkuDto = {
      productId: data.productId,
      price: parseFloat(data.price),
      attributes,
    };
    await create.mutateAsync(dto);
    cancel();
  }

  return (
    <PageContainer size="lg" py={8}>
      <HStack mb={6} justify="space-between">
        <Heading textStyle="h1" color="fg">
          SKUs
        </Heading>

        {!showForm && (
          <Button size="sm" colorPalette="blue" onClick={handleShowForm}>
            + New SKU
          </Button>
        )}
      </HStack>

      {showForm && (
        <Card mb={6} p={5}>
          <Text
            fontSize="xs"
            fontWeight="700"
            color="fg.muted"
            textTransform="uppercase"
            letterSpacing="0.08em"
            mb={4}
          >
            New SKU
          </Text>

          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={3} align="stretch">
              <FormField name="productId" label="Product" error={errors.productId}>
                <NativeSelect.Root>
                  <NativeSelect.Field id="productId" {...register("productId")}>
                    <option value="">Product…</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </FormField>

              <FormField name="price" label="Price" error={errors.price}>
                <Input id="price" placeholder="Price (e.g. 29.99)" {...register("price")} />
              </FormField>

              <FormField name="size" label="Size" error={errors.size}>
                <Input id="size" placeholder="Size (optional, e.g. M)" {...register("size")} />
              </FormField>

              <FormField name="color" label="Color" error={errors.color}>
                <Input id="color" placeholder="Color (optional)" {...register("color")} />
              </FormField>

              <FormField name="edition" label="Edition" error={errors.edition}>
                <Input id="edition" placeholder="Edition (optional)" {...register("edition")} />
              </FormField>

              <HStack justify="flex-end">
                <Button size="sm" variant="ghost" color="fg.muted" onClick={cancel}>
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

      <Card mb={6} p={4}>
        <Text
          fontSize="xs"
          fontWeight="700"
          color="fg.muted"
          textTransform="uppercase"
          letterSpacing="0.08em"
          mb={3}
        >
          Bulk availability
        </Text>

        <HStack gap={3}>
          <NativeSelect.Root>
            <NativeSelect.Field
              aria-label="Facet"
              value={bulkFacet}
              onChange={handleBulkFacetChange}
            >
              <option value="game">Game</option>
              <option value="team">Team</option>
              <option value="character">Character</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <NativeSelect.Root>
            <NativeSelect.Field
              aria-label="Facet value"
              value={bulkFacetId}
              onChange={handleBulkFacetIdChange}
            >
              <option value="">Select…</option>
              {bulkFacetOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <NativeSelect.Root>
            <NativeSelect.Field
              aria-label="Available"
              value={String(bulkAvailable)}
              onChange={handleBulkAvailableChange}
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <Button
            size="sm"
            colorPalette="blue"
            disabled={!bulkFacetId}
            loading={bulk.isPending}
            onClick={handleApplyBulk}
          >
            Apply
          </Button>
        </HStack>
      </Card>

      {isLoading && <Text color="fg.muted">Loading…</Text>}
      {error && <Text color="danger.fg">Failed to load SKUs.</Text>}

      {!isLoading && !error && allSkus.length === 0 && (
        <EmptyState title="No SKUs yet." icon={<Tags size={28} strokeWidth={1.5} />} />
      )}

      {!isLoading && !error && allSkus.length > 0 && (
        <AdminTable columns={COLUMNS} hasActionsColumn>
          {allSkus.map((sku) => {
            const handleToggle = () =>
              void toggle.mutateAsync({ id: sku.id, available: !sku.available });
            const handleDeleteStart = () => setConfirmDelete(sku.id);
            const handleDeleteCancel = () => setConfirmDelete(null);
            const handleDeleteConfirm = () =>
              void del.mutateAsync(sku.id).then(() => setConfirmDelete(null));
            return (
              <AdminTableRow key={sku.id} data-testid={`sku-row-${sku.id}`}>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg" fontWeight="600">
                    {sku.productName}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted">
                    ${sku.price.toFixed(2)}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted">
                    {sku.size ?? "—"}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted">
                    {sku.color ?? "—"}
                  </Text>
                </AdminTableCell>
                <AdminTableCell>
                  <Text fontSize="sm" color="fg.muted">
                    {sku.edition ?? "—"}
                  </Text>
                </AdminTableCell>
                <AdminTableCell align="right">
                  <HStack justify="flex-end" gap={1}>
                    <Button
                      size="xs"
                      colorPalette={sku.available ? "success" : "gray"}
                      variant="subtle"
                      loading={toggle.isPending && toggle.variables?.id === sku.id}
                      onClick={handleToggle}
                    >
                      {sku.available ? "Available" : "Unavailable"}
                    </Button>

                    {confirmDelete === sku.id ? (
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
