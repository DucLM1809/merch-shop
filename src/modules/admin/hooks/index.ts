import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/api/client";
import { catalogKeys } from "@/modules/catalog";

import type { CreateGameDto, CreatePublisherDto, CreateTeamDto } from "@/api/types";

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
