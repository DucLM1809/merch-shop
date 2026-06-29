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

import { useCharacters, useGames, useProducts, usePublishers, useTeams } from "@/modules/catalog";

import { useCreateProduct, useDeleteProduct, useUpdateProduct } from "../hooks";

import type { CreateProductDto, Product } from "@/api/types";

type FormState = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  price: string;
  publisherId: string;
  gameId: string;
  teamId: string;
  characterId: string;
};

const EMPTY: FormState = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  price: "",
  publisherId: "",
  gameId: "",
  teamId: "",
  characterId: "",
};

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
  const [form, setForm] = useState<FormState>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function openCreate() {
    setMode("create");
    setForm(EMPTY);
  }

  function openEdit(product: Product) {
    setMode({ edit: product });
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      imageUrl: product.imageUrl ?? "",
      price: String(product.price),
      publisherId: product.publisherId,
      gameId: product.gameId,
      teamId: product.teamId ?? "",
      characterId: product.characterId ?? "",
    });
    setConfirmDelete(null);
  }

  function cancel() {
    setMode("idle");
    setForm(EMPTY);
  }

  async function submit() {
    const dto: CreateProductDto = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      price: parseFloat(form.price),
      publisherId: form.publisherId,
      gameId: form.gameId,
      ...(form.description.trim() && { description: form.description.trim() }),
      ...(form.imageUrl.trim() && { imageUrl: form.imageUrl.trim() }),
      ...(form.teamId && { teamId: form.teamId }),
      ...(form.characterId && { characterId: form.characterId }),
    };
    if (typeof mode === "object") {
      await update.mutateAsync({ id: mode.edit.id, body: dto });
    } else {
      await create.mutateAsync(dto);
    }
    cancel();
  }

  const isPending = create.isPending || update.isPending;
  const isValid =
    !!form.name.trim() &&
    !!form.slug.trim() &&
    !!form.price &&
    !isNaN(parseFloat(form.price)) &&
    !!form.publisherId &&
    !!form.gameId;

  const selectStyle = {
    bg: "gray.800",
    border: "1px solid",
    borderColor: "gray.700",
    borderRadius: "md",
    px: 3,
    py: 2,
    fontSize: "sm",
  };

  return (
    <Box p={8}>
      <HStack mb={6} justify="space-between">
        <Heading size="lg" color="white">
          Products
        </Heading>

        {mode === "idle" && (
          <Button size="sm" colorPalette="blue" onClick={openCreate}>
            + New Product
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
            {typeof mode === "object" ? "Edit Product" : "New Product"}
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
              placeholder="Slug (e.g. jinx-hoodie)"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />
            <Input
              placeholder="Price (e.g. 29.99)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />
            <Input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />
            <Input
              placeholder="Image URL (optional)"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              bg="gray.800"
              borderColor="gray.700"
              color="white"
            />
            <NativeSelectRoot unstyled>
              <NativeSelectField
                value={form.publisherId}
                onChange={(e) => setForm((f) => ({ ...f, publisherId: e.target.value }))}
                color={form.publisherId ? "white" : "gray.500"}
                {...selectStyle}
              >
                <option value="">Publisher…</option>
                {publishers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
            <NativeSelectRoot unstyled>
              <NativeSelectField
                value={form.gameId}
                onChange={(e) => setForm((f) => ({ ...f, gameId: e.target.value }))}
                color={form.gameId ? "white" : "gray.500"}
                {...selectStyle}
              >
                <option value="">Game…</option>
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
            <NativeSelectRoot unstyled>
              <NativeSelectField
                value={form.teamId}
                onChange={(e) => setForm((f) => ({ ...f, teamId: e.target.value }))}
                color={form.teamId ? "white" : "gray.500"}
                {...selectStyle}
              >
                <option value="">Team (optional)…</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
            <NativeSelectRoot unstyled>
              <NativeSelectField
                value={form.characterId}
                onChange={(e) => setForm((f) => ({ ...f, characterId: e.target.value }))}
                color={form.characterId ? "white" : "gray.500"}
                {...selectStyle}
              >
                <option value="">Character (optional)…</option>
                {characters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>

            <HStack justify="flex-end">
              <Button size="sm" variant="ghost" color="gray.400" onClick={cancel}>
                Cancel
              </Button>
              <Button
                size="sm"
                colorPalette="blue"
                onClick={() => void submit()}
                loading={isPending}
                disabled={!isValid}
              >
                Save
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

      {isLoading && <Text color="gray.500">Loading…</Text>}
      {error && <Text color="red.400">Failed to load products.</Text>}

      {!isLoading && !error && products.length === 0 && (
        <Text color="gray.400">No products yet.</Text>
      )}

      {!isLoading && !error && products.length > 0 && (
        <Box border="1px solid" borderColor="gray.800" borderRadius="lg" overflow="hidden">
          <Flex px={4} py={3} bg="gray.900" borderBottom="1px solid" borderColor="gray.800">
            {(
              [
                ["Name", 2],
                ["Slug", 2],
                ["Price", 1],
                ["Publisher", 1.5],
                ["Game", 1.5],
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
            <Box w="160px" />
          </Flex>

          {products.map((product, i) => {
            const publisher = publishers.find((p) => p.id === product.publisherId);
            const game = games.find((g) => g.id === product.gameId);
            return (
              <Flex
                key={product.id}
                px={4}
                py={3.5}
                align="center"
                borderBottom={i < products.length - 1 ? "1px solid" : "none"}
                borderColor="gray.800"
              >
                <Text flex={2} fontSize="sm" color="white" fontWeight="600">
                  {product.name}
                </Text>
                <Text flex={2} fontSize="sm" color="gray.400" fontFamily="mono">
                  {product.slug}
                </Text>
                <Text flex={1} fontSize="sm" color="gray.400">
                  ${product.price.toFixed(2)}
                </Text>
                <Text flex={1.5} fontSize="sm" color="gray.400">
                  {publisher?.name ?? product.publisherId}
                </Text>
                <Text flex={1.5} fontSize="sm" color="gray.400">
                  {game?.name ?? product.gameId}
                </Text>

                <HStack w="160px" justify="flex-end" gap={1}>
                  <Button
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: "white" }}
                    onClick={() => openEdit(product)}
                  >
                    Edit
                  </Button>

                  {confirmDelete === product.id ? (
                    <HStack gap={1}>
                      <Button
                        size="xs"
                        colorPalette="red"
                        loading={del.isPending}
                        onClick={() =>
                          void del.mutateAsync(product.id).then(() => setConfirmDelete(null))
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
                      onClick={() => setConfirmDelete(product.id)}
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
