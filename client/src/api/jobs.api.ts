import api from "./axios";

export interface JobClient {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Job {
  _id: string;
  client: string | JobClient;

  title: string;
  description: string;

  skills: string[];

  budget: number;
  budgetType: "fixed" | "hourly";

  experienceLevel: "entry" | "intermediate" | "expert";

  deadline?: string;

  status:
    | "open"
    | "in_progress"
    | "completed"
    | "cancelled";

  locationType: "remote" | "onsite" | "hybrid";

  country: string;
  city: string;

  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  success: boolean;
  count?: number;
  jobs: Job[];

  pagination?: {
    page: number;
    limit: number;
    totalJobs: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateJobData {
  title: string;
  description: string;

  budget: number;
  budgetType: "fixed" | "hourly";

  skills: string[];

  experienceLevel:
    | "entry"
    | "intermediate"
    | "expert";

  deadline?: string;

  locationType:
    | "remote"
    | "onsite"
    | "hybrid";

  country: string;
  city: string;
}

export interface UpdateJobData {
  title?: string;
  description?: string;

  budget?: number;
  budgetType?: "fixed" | "hourly";

  skills?: string[];

  experienceLevel?:
    | "entry"
    | "intermediate"
    | "expert";

  deadline?: string;

  status?:
    | "open"
    | "in_progress"
    | "completed"
    | "cancelled";

  locationType?:
    | "remote"
    | "onsite"
    | "hybrid";

  country?: string;
  city?: string;
}

export interface CreateJobResponse {
  success: boolean;
  message: string;
  job: Job;
}

export interface UpdateJobResponse {
  success: boolean;
  message: string;
  job: Job;
}

export interface DeleteJobResponse {
  success: boolean;
  message: string;
}

export const getJobs = async (): Promise<JobsResponse> => {
  const response = await api.get("/jobs");

  return response.data;
};

export const getMyJobs = async (): Promise<JobsResponse> => {
  const response = await api.get("/jobs/my");

  return response.data;
};

export const getJobById = async (
  jobId: string,
): Promise<Job> => {
  const response = await api.get(`/jobs/${jobId}`);

  return response.data.job;
};

export const createJob = async (
  data: CreateJobData,
): Promise<CreateJobResponse> => {
  const response = await api.post("/jobs", data);

  return response.data;
};

export const updateJob = async (
  jobId: string,
  data: UpdateJobData,
): Promise<UpdateJobResponse> => {
  const response = await api.patch(
    `/jobs/${jobId}`,
    data,
  );

  return response.data;
};

export const deleteJob = async (
  jobId: string,
): Promise<DeleteJobResponse> => {
  const response = await api.delete(
    `/jobs/${jobId}`,
  );

  return response.data;
};

export const completeJob = async (
  jobId: string,
): Promise<UpdateJobResponse> => {
  const response = await api.patch(
    `/jobs/${jobId}/complete`,
  );

  return response.data;
};



export interface JobMatch {
  developerProfileId: string;

  developer: {
    firstName: string;
    lastName: string;
  };

  availability: "available" | "busy";

  skills: {
    matched: string[];
    missing: string[];
    matchedCount: number;
    requiredCount: number;
  };

  experience: {
    years: number;
    requirement: "entry" | "intermediate" | "expert";
    meetsRequirement: boolean;
  };

  portfolioEvidence: {
    projectId: string;
    title: string;
    matchedSkills: string[];
  }[];

  reasons: string[];
}

export interface JobMatchesResponse {
  success: boolean;
  matchingMethod: "rule-based-v1";
  jobId: string;
  matches: JobMatch[];

  meta: {
    returned: number;
    excluded: {
      unavailable: number;
      noSkillMatch: number;
    };
  };
}


export const getJobMatches = async (
  jobId: string,
): Promise<JobMatchesResponse> => {
  const response = await api.get(
    `/jobs/${jobId}/matches`,
  );

  return response.data;
};