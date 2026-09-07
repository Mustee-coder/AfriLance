import api from "./axios";

export interface CreateApplicationData {
  jobId: string;
  coverLetter: string;
  bidAmount: number;
  estimatedDays: number;
}

export interface ApplicationDeveloper {
  _id: string;
  firstName: string;
  lastName: string;
  role: "developer";
}

export interface ApplicationJob {
  _id: string;
  title: string;
}

export interface Application {
  _id: string;

  job:
    | string
    | ApplicationJob;

  developer:
    | string
    | ApplicationDeveloper;

  coverLetter: string;
  bidAmount: number;
  estimatedDays: number;

  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "withdrawn";

  createdAt: string;
  updatedAt: string;
}

export interface ApplicationsResponse {
  success: boolean;
  count?: number;
  applications: Application[];
}

export interface ApplicationResponse {
  success: boolean;
  message?: string;
  application: Application;
}

export interface UpdateApplicationStatusResponse {
  success: boolean;
  message: string;
  application: Application;
  job?: {
    id: string;
    status: "open" | "in_progress" | "completed" | "cancelled";
  };
}

export const createApplication = async (
  data: CreateApplicationData,
): Promise<ApplicationResponse> => {
  const response = await api.post(
    "/applications",
    data,
  );

  return response.data;
};

export const getMyApplications =
  async (): Promise<ApplicationsResponse> => {
    const response = await api.get(
      "/applications/my",
    );

    return response.data;
  };

export const getApplicationById = async (
  applicationId: string,
): Promise<ApplicationResponse> => {
  const response = await api.get(
    `/applications/${applicationId}`,
  );

  return response.data;
};

export const withdrawApplication = async (
  applicationId: string,
) => {
  const response = await api.delete(
    `/applications/${applicationId}`,
  );

  return response.data;
};

export const getJobApplications = async (
  jobId: string,
): Promise<ApplicationsResponse> => {
  const response = await api.get(
    `/applications/job/${jobId}`,
  );

  return response.data;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: "accepted" | "rejected",
): Promise<UpdateApplicationStatusResponse> => {
  const response = await api.patch(
    `/applications/${applicationId}/status`,
    { status },
  );

  return response.data;
};