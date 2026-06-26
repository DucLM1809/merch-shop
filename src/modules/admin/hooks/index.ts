import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/api/client";
import { catalogKeys } from "@/modules/catalog";

import type { CreatePublisherDto } from "@/api/types";

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
