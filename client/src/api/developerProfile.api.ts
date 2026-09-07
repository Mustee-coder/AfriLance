import api from "./axios";

export interface PortfolioProject {
  _id?: string;
  title: string;
  description: string;
  projectUrl?: string;
}

export type Availability =
  | "available"
  | "busy"
  | "unavailable";

export interface DeveloperProfile {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    role: "developer";
  };
  bio?: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  availability: Availability;
  portfolio: PortfolioProject[];
  createdAt: string;
  updatedAt: string;
}

export interface DeveloperProfileResponse {
  success: boolean;
  profile: DeveloperProfile;
  message?: string;
}

export interface DeveloperProfileData {
  bio?: string;
  skills: string[];
  experience?: number;
  hourlyRate?: number;
  availability?: Availability;
  portfolio?: PortfolioProject[];
}

export const getMyDeveloperProfile =
  async (): Promise<DeveloperProfileResponse> => {
    const response = await api.get("/developer-profiles/me");

    return response.data;
  };

export const createDeveloperProfile = async (
  data: DeveloperProfileData,
): Promise<DeveloperProfileResponse> => {
  const response = await api.post("/developer-profiles", data);

  return response.data;
};

export const updateDeveloperProfile = async (
  data: DeveloperProfileData,
): Promise<DeveloperProfileResponse> => {
  const response = await api.patch(
    "/developer-profiles/me",
    data,
  );

  return response.data;
};
