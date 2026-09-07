import api from "./axios";

import type {
  DeveloperDashboardResponse,
  ClientDashboardResponse,
} from "@/types/dashboard";

export const getDeveloperDashboard =
  async (): Promise<DeveloperDashboardResponse> => {
    const response = await api.get("/dashboard/developer");

    return response.data;
  };

export const getClientDashboard =
  async (): Promise<ClientDashboardResponse> => {
    const response = await api.get("/dashboard/client");

    return response.data;
  };
