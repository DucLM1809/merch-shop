import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/api/client";
import { catalogKeys } from "@/modules/catalog";

import type {
  CreateCharacterDto,
  CreateGameDto,
  CreateProductDto,
  CreatePublisherDto,
  CreateSkuDto,
  CreateTeamDto,
} from "@/api/types";

export function useCreatePublisher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePublisherDto) => client.createPublisher(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.publishers() });
    },
  });
}

export function useUpdatePublisher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CreatePublisherDto }) =>
      client.updatePublisher(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.publishers() });
    },
  });
}

export function useDeletePublisher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.deletePublisher(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.publishers() });
    },
  });
}

export function useCreateGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateGameDto) => client.createGame(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.games() });
      void qc.invalidateQueries({ queryKey: catalogKeys.publishers() });
    },
  });
}

export function useUpdateGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CreateGameDto }) => client.updateGame(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.games() });
      void qc.invalidateQueries({ queryKey: catalogKeys.publishers() });
    },
  });
}

export function useDeleteGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.deleteGame(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.games() });
      void qc.invalidateQueries({ queryKey: catalogKeys.publishers() });
    },
  });
}

export function useCreateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTeamDto) => client.createTeam(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.teams() });
    },
  });
}

export function useUpdateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CreateTeamDto }) => client.updateTeam(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.teams() });
    },
  });
}

export function useDeleteTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.deleteTeam(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.teams() });
    },
  });
}

export function useCreateCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCharacterDto) => client.createCharacter(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.characters() });
    },
  });
}

export function useUpdateCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CreateCharacterDto }) =>
      client.updateCharacter(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.characters() });
    },
  });
}

export function useDeleteCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.deleteCharacter(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.characters() });
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProductDto) => client.createProduct(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.products() });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CreateProductDto }) =>
      client.updateProduct(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.products() });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.deleteProduct(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.products() });
    },
  });
}

export function useCreateSku() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSkuDto) => client.createSku(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.products() });
    },
  });
}

export function useSetSkuAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) =>
      client.setSkuAvailability(id, available),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.products() });
    },
  });
}

export function useDeleteSku() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.deleteSku(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.products() });
    },
  });
}
