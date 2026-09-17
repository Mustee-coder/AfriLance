import api from "./axios";

export interface AIJobDraft {
  title: string;
  description: string;
  skills: string[];
  experienceLevel: "entry" | "intermediate" | "expert";
  requirements: string[];
  deliverables: string[];
}

export interface GenerateJobResponse {
  success: boolean;
  message: string;
  draft: AIJobDraft;
}

export const generateJobDraft = async (
  idea: string,
): Promise<GenerateJobResponse> => {
  const response = await api.post("/ai/generate-job", {
    idea,
  });

  return response.data;
};


export interface AIRequirements {
  skills: string[];
  requirements: string[];
}

export interface ExtractRequirementsResponse {
  success: boolean;
  message: string;
  result: AIRequirements;
}

export const extractJobRequirements = async (
  idea: string,
): Promise<ExtractRequirementsResponse> => {
  const response = await api.post("/ai/extract-requirements", {
    idea,
  });

  return response.data;
};
