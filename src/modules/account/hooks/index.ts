import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/api/client";

export const accountKeys = {
  all: ["account"] as const,
  me: () => [...accountKeys.all, "me"] as const,
};

export function useAccount(enabled = true) {
  const result = useQuery({
    queryKey: accountKeys.me(),
    queryFn: () => client.getMyAccount(),
    enabled,
    select: (r) => r.data,
  });
  return { ...result, error: result.error };
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}
