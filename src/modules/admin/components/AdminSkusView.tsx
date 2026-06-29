import { useState } from "react";

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

import { useProducts } from "@/modules/catalog";

import { useCreateSku, useDeleteSku, useSetSkuAvailability } from "../hooks";

import type { CreateSkuDto, Product, SKU } from "@/api/types";

type EnrichedSku = SKU & { productId: string; productName: string };

type FormState = {
  productId: string;
  price: string;
  size: string;
  color: string;
  edition: string;
};

const EMPTY: FormState = { productId: "", price: "", size: "", color: "", edition: "" };

export function AdminSkusView(): React.JSX.Element {
  const { data: products = [], isLoading, error } = useProducts();
  const create = useCreateSku();
  const toggle = useSetSkuAvailability();
  const del = useDeleteSku();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const allSkus: EnrichedSku[] = products.flatMap((p: Product) =>
    (p.skus ?? []).map((s) => ({ ...s, productId: p.id, productName: p.name }))
  );

  function cancel() {
    setShowForm(false);
    setForm(EMPTY);
  }

  async function submit() {
    const dto: CreateSkuDto = {
      productId: form.productId,
      price: parseFloat(form.price),
      ...(form.size.trim() && { size: form.size.trim() }),
      ...(form.color.trim() && { color: form.color.trim() }),
      ...(form.edition.trim() && { edition: form.edition.trim() }),
    };
    await create.mutateAsync(dto);
    cancel();
  }

  const isValid = !!form.productId && !!form.price && !isNaN(parseFloat(form.price));

  return (
    <Box p={8}>
      <HStack mb={6} justify="space-between">
        <Heading size="lg" color="white">
          SKUs
        </Heading>

        {!showForm && (
          <Button size="sm" colorPalette="blue" onClick={() => setShowForm(true)}>
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

          <VStack gap={3} align="stretch">
            <NativeSelectRoot unstyled>
              <NativeSelectField
                value={form.productId}
                onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
                bg="gray.800"
                border="1px solid"
                borderColor="gray.700"
                borderRadius="md"
                color={form.productId ? "white" : "gray.500"}
                px={3}
                py={2}
                fontSize="sm"
              >
                <option value="">Product…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
            <Input
              placeholder="Price (e.g. 29.99)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />
            <Input
              placeholder="Size (optional, e.g. M)"
              value={form.size}
              onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />
            <Input
              placeholder="Color (optional)"
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />
            <Input
              placeholder="Edition (optional)"
              value={form.edition}
              onChange={(e) => setForm((f) => ({ ...f, edition: e.target.value }))}
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
                loading={create.isPending}
                disabled={!isValid}
              >
                Save
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

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
