import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createClientProfile,
  deleteClientProfile,
  getClientProfileByUserId,
  getMyClientProfile,
  updateClientProfile,
} from "@/api/clientProfile.api";

import type { ClientProfileFormData } from "@/types/clientProfile";

export const useClientProfile = () => {
  return useQuery({
    queryKey: ["client-profile"],
    queryFn: getMyClientProfile,
  });
};

export const useCreateClientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientProfileFormData) =>
      createClientProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["client-dashboard"],
      });
    },
  });
};

export const useUpdateClientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientProfileFormData) =>
      updateClientProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["client-dashboard"],
      });
    },
  });
};

export const useDeleteClientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClientProfile,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["client-profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["client-dashboard"],
      });
    },
  });
};

export const useClientProfileByUserId = (
  userId: string,
) => {
  return useQuery({
    queryKey: ["client-profile", "user", userId],
    queryFn: () =>
      getClientProfileByUserId(userId),
    enabled: Boolean(userId),
  });
};
