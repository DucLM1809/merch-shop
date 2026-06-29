import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { FormField } from "@/components/FormField";

import { useCreateProduct, useDeleteProduct, useUpdateProduct } from "../hooks";

import type { CreateProductDto, Product } from "@/api/types";

const schema = z.object({
  name: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  price: z
    .string()
    .min(1, "Required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Must be a positive number")
    .transform((v) => parseFloat(v)),
  description: z.string(),
  imageUrl: z.string(),
  publisherId: z.string().min(1, "Required"),
  gameId: z.string().min(1, "Required"),
  teamId: z.string(),
  characterId: z.string(),
});

type FormIn = z.input<typeof schema>;
type FormOut = z.infer<typeof schema>;

const DEFAULTS: FormIn = {
  name: "",
  slug: "",
  price: "",
  description: "",
  imageUrl: "",
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
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: DEFAULTS,
  });

  const [watchPublisherId, watchGameId, watchTeamId, watchCharacterId] = watch([
    "publisherId",
    "gameId",
    "teamId",
    "characterId",
  ]);

  function openCreate() {
    setMode("create");
    reset(DEFAULTS);
  }

  function openEdit(product: Product) {
    setMode({ edit: product });
    reset({
      name: product.name,
      slug: product.slug,
      price: String(product.price),
      description: product.description ?? "",
      imageUrl: product.imageUrl ?? "",
      publisherId: product.publisherId,
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

  async function onSubmit(data: FormOut) {
    const dto: CreateProductDto = {
      name: data.name.trim(),
      slug: data.slug.trim(),
      price: data.price,
      publisherId: data.publisherId,
      gameId: data.gameId,
      ...(data.description.trim() && { description: data.description.trim() }),
      ...(data.imageUrl.trim() && { imageUrl: data.imageUrl.trim() }),
      ...(data.teamId && { teamId: data.teamId }),
      ...(data.characterId && { characterId: data.characterId }),
    };
    if (typeof mode === "object") {
      await update.mutateAsync({ id: mode.edit.id, body: dto });
    } else {
      await create.mutateAsync(dto);
    }
    cancel();
  }

  const isPending = create.isPending || update.isPending;

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
            <FormField error={errors.name}>
              <Input
                placeholder="Name"
                {...register("name")}
                bg="gray.800"
                borderColor="gray.700"
                color="white"
              />
            </FormField>

            <FormField error={errors.slug}>
              <Input
                placeholder="Slug (e.g. jinx-hoodie)"
                {...register("slug")}
                bg="gray.800"
                borderColor="gray.700"
                color="white"
              />
            </FormField>

            <FormField error={errors.price}>
              <Input
                placeholder="Price (e.g. 29.99)"
                {...register("price")}
                bg="gray.800"
                borderColor="gray.700"
                color="white"
              />
            </FormField>

            <FormField error={errors.description}>
              <Input
                placeholder="Description (optional)"
                {...register("description")}
                bg="gray.800"
                borderColor="gray.700"
                color="white"
              />
            </FormField>

            <FormField error={errors.imageUrl}>
              <Input
                placeholder="Image URL (optional)"
                {...register("imageUrl")}
                bg="gray.800"
                borderColor="gray.700"
                color="white"
              />
            </FormField>

            <FormField error={errors.publisherId}>
              <NativeSelectRoot unstyled>
                <NativeSelectField
                  {...register("publisherId")}
                  color={watchPublisherId ? "white" : "gray.500"}
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
            </FormField>

            <FormField error={errors.gameId}>
              <NativeSelectRoot unstyled>
                <NativeSelectField
                  {...register("gameId")}
                  color={watchGameId ? "white" : "gray.500"}
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
            </FormField>

            <NativeSelectRoot unstyled>
              <NativeSelectField
                {...register("teamId")}
                color={watchTeamId ? "white" : "gray.500"}
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
                {...register("characterId")}
                color={watchCharacterId ? "white" : "gray.500"}
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
                onClick={() => void handleSubmit(onSubmit)()}
                loading={isPending}
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
