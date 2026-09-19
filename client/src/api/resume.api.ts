import api from "./axios";

export interface ResumeExperience {
  _id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface ResumeEducation {
  _id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ResumeProject {
  _id?: string;
  title: string;
  description: string;
  projectUrl?: string;
}

export interface ResumeCertification {
  _id?: string;
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface Resume {
  _id: string;
  user: string;

  headline?: string;
  professionalSummary?: string;

  skills: string[];

  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];

  template: "classic" | "modern" | "minimal";

  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeData {
  headline?: string;
  professionalSummary?: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  template: "classic" | "modern" | "minimal";
}

export type UpdateResumeData = Partial<CreateResumeData>;

interface ResumeResponse {
  success: boolean;
  message?: string;
  resume: Resume;
}

export const createResume = async (
  data: CreateResumeData,
): Promise<ResumeResponse> => {
  const response = await api.post("/resumes", data);

  return response.data;
};

export const getMyResume = async (): Promise<ResumeResponse> => {
  const response = await api.get("/resumes/me");

  return response.data;
};

export const updateMyResume = async (
  data: UpdateResumeData,
): Promise<ResumeResponse> => {
  const response = await api.put("/resumes/me", data);

  return response.data;
};