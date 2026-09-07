import api from "./axios";

import type {
  ClientProfileFormData,
  ClientProfileMutationResponse,
  ClientProfileResponse,
} from "@/types/clientProfile";

export const getMyClientProfile =
  async (): Promise<ClientProfileResponse> => {
    const response = await api.get(
      "/client-profiles/me",
    );

    return response.data;
  };

export const createClientProfile = async (
  data: ClientProfileFormData,
): Promise<ClientProfileMutationResponse> => {
  const response = await api.post(
    "/client-profiles",
    data,
  );

  return response.data;
};

export const updateClientProfile = async (
  data: ClientProfileFormData,
): Promise<ClientProfileMutationResponse> => {
  const response = await api.patch(
    "/client-profiles/me",
    data,
  );

  return response.data;
};

export const deleteClientProfile = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await api.delete(
    "/client-profiles/me",
  );

  return response.data;
};

export const getClientProfileByUserId = async (
  userId: string,
): Promise<ClientProfileResponse> => {
  const response = await api.get(
    `/client-profiles/user/${userId}`,
  );

  return response.data;
};
