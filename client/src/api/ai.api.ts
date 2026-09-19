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

export interface AIResumeExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface AIResumeProject {
  title: string;
  description: string;
  projectUrl?: string;
}

export interface AIResumeEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface AIResumeCertification {
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface ImproveCVData {
  headline?: string;
  professionalSummary?: string;
  skills: string[];
  experience: AIResumeExperience[];
  projects: AIResumeProject[];
  education: AIResumeEducation[];
  certifications: AIResumeCertification[];
}

export interface ImproveCVResponse {
  success: boolean;
  message: string;
  resume: ImproveCVData;
}

export const improveCV = async (
  resume: ImproveCVData,
): Promise<ImproveCVResponse> => {
  const response = await api.post(
    "/ai/improve-cv",
    resume,
  );

  return response.data;
};