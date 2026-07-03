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

import { FormField } from "@/components/FormField";
import { useCharacters, useGames, useProducts, useTeams } from "@/modules/catalog";

import {
  useBulkSetSkuAvailability,
  useCreateSku,
  useDeleteSku,
  useSetSkuAvailability,
} from "../hooks";

import { schema, DEFAULTS } from "./AdminSkusView.schema";

import type { FormValues } from "./AdminSkusView.schema";
import type { CreateSkuDto, Product, SKU, SkuFacet } from "@/api/types";

type EnrichedSku = SKU & { productId: string; productName: string };

export function AdminSkusView(): React.JSX.Element {
  const { data: products = [], isLoading, error } = useProducts();
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
    const dto: CreateSkuDto = {
      productId: data.productId,
      price: parseFloat(data.price),
      ...(data.size.trim() && { size: data.size.trim() }),
      ...(data.color.trim() && { color: data.color.trim() }),
      ...(data.edition.trim() && { edition: data.edition.trim() }),
    };
    await create.mutateAsync(dto);
    cancel();
  }

  const selectStyle = {
    bg: "gray.800",
    border: "1px solid",
    borderColor: "gray.700",
    borderRadius: "md",
    color: "white",
    px: 3,
    py: 2,
    fontSize: "sm",
  } as const;

  return (
    <Box p={8}>
      <HStack mb={6} justify="space-between">
        <Heading size="lg" color="white">
          SKUs
        </Heading>

        {!showForm && (
          <Button size="sm" colorPalette="blue" onClick={handleShowForm}>
            + New SKU
          </Button>
        )}
      </HStack>

      {showForm && (
        <Box mb={6} p={5} bg="gray.900" borderRadius="lg" border="1px solid" borderColor="gray.700">
          <Text
            fontSize="xs"
            fontWeight="700"
            color="gray.500"
            textTransform="uppercase"
            letterSpacing="0.08em"
            mb={4}
          >
            New SKU
          </Text>

          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={3} align="stretch">
              <FormField name="productId" label="Product" error={errors.productId}>
                <NativeSelectRoot unstyled>
                  <NativeSelectField id="productId" {...register("productId")} {...selectStyle}>
                    <option value="">Product…</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </NativeSelectField>
                </NativeSelectRoot>
              </FormField>

              <FormField name="price" label="Price" error={errors.price}>
                <Input
                  id="price"
                  placeholder="Price (e.g. 29.99)"
                  {...register("price")}
                  bg="gray.800"
                  borderColor="gray.700"
                  color="white"
                />
              </FormField>

              <FormField name="size" label="Size" error={errors.size}>
                <Input
                  id="size"
                  placeholder="Size (optional, e.g. M)"
                  {...register("size")}
                  bg="gray.800"
                  borderColor="gray.700"
                  color="white"
                />
              </FormField>

              <FormField name="color" label="Color" error={errors.color}>
                <Input
                  id="color"
                  placeholder="Color (optional)"
                  {...register("color")}
                  bg="gray.800"
                  borderColor="gray.700"
                  color="white"
                />
              </FormField>

              <FormField name="edition" label="Edition" error={errors.edition}>
                <Input
                  id="edition"
                  placeholder="Edition (optional)"
                  {...register("edition")}
                  bg="gray.800"
                  borderColor="gray.700"
                  color="white"
                />
              </FormField>

              <HStack justify="flex-end">
                <Button size="sm" variant="ghost" color="gray.400" onClick={cancel}>
                  Cancel
                </Button>
                <Button size="sm" colorPalette="blue" type="submit" loading={isSubmitting}>
                  Save
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}

      <Box mb={6} p={4} bg="gray.900" borderRadius="lg" border="1px solid" borderColor="gray.700">
        <Text
          fontSize="xs"
          fontWeight="700"
          color="gray.500"
          textTransform="uppercase"
          letterSpacing="0.08em"
          mb={3}
        >
          Bulk availability
        </Text>

        <HStack gap={3}>
          <NativeSelectRoot unstyled>
            <NativeSelectField
              aria-label="Facet"
              value={bulkFacet}
              onChange={handleBulkFacetChange}
              {...selectStyle}
            >
              <option value="game">Game</option>
              <option value="team">Team</option>
              <option value="character">Character</option>
            </NativeSelectField>
          </NativeSelectRoot>

          <NativeSelectRoot unstyled>
            <NativeSelectField
              aria-label="Facet value"
              value={bulkFacetId}
              onChange={handleBulkFacetIdChange}
              {...selectStyle}
            >
              <option value="">Select…</option>
              {bulkFacetOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>

          <NativeSelectRoot unstyled>
            <NativeSelectField
              aria-label="Available"
              value={String(bulkAvailable)}
              onChange={handleBulkAvailableChange}
              {...selectStyle}
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </NativeSelectField>
          </NativeSelectRoot>

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
      </Box>

      {isLoading && <Text color="gray.500">Loading…</Text>}
      {error && <Text color="red.400">Failed to load SKUs.</Text>}

      {!isLoading && !error && allSkus.length === 0 && <Text color="gray.400">No SKUs yet.</Text>}

      {!isLoading && !error && allSkus.length > 0 && (
        <Box border="1px solid" borderColor="gray.800" borderRadius="lg" overflow="hidden">
          <Flex px={4} py={3} bg="gray.900" borderBottom="1px solid" borderColor="gray.800">
            {(
              [
                ["Product", 2],
                ["Price", 1],
                ["Size", 1],
                ["Color", 1],
                ["Edition", 1],
              ] as [string, number][]
            ).map(([label, flex]) => (
              <Text
                key={label}
                flex={flex}
                fontSize="xs"
                fontWeight="700"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="0.08em"
              >
                {label}
              </Text>
            ))}
            <Box w="200px" />
          </Flex>

          {allSkus.map((sku, i) => (
            <Flex
              key={sku.id}
              px={4}
              py={3.5}
              align="center"
              borderBottom={i < allSkus.length - 1 ? "1px solid" : "none"}
              borderColor="gray.800"
            >
              <Text flex={2} fontSize="sm" color="white" fontWeight="600">
                {sku.productName}
              </Text>
              <Text flex={1} fontSize="sm" color="gray.400">
                ${sku.price.toFixed(2)}
              </Text>
              <Text flex={1} fontSize="sm" color="gray.400">
                {sku.size ?? "—"}
              </Text>
              <Text flex={1} fontSize="sm" color="gray.400">
                {sku.color ?? "—"}
              </Text>
              <Text flex={1} fontSize="sm" color="gray.400">
                {sku.edition ?? "—"}
              </Text>

              <HStack w="200px" justify="flex-end" gap={1}>
                <Button
                  size="xs"
                  colorPalette={sku.available ? "green" : "gray"}
                  variant="subtle"
                  loading={toggle.isPending && toggle.variables?.id === sku.id}
                  onClick={() => void toggle.mutateAsync({ id: sku.id, available: !sku.available })}
                >
                  {sku.available ? "Available" : "Unavailable"}
                </Button>

                {confirmDelete === sku.id ? (
                  <HStack gap={1}>
                    <Button
                      size="xs"
                      colorPalette="red"
                      loading={del.isPending}
                      onClick={() =>
                        void del.mutateAsync(sku.id).then(() => setConfirmDelete(null))
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
                    onClick={() => setConfirmDelete(sku.id)}
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
