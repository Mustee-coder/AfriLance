export type Availability =
  | "available"
  | "busy"
  | "unavailable";

export interface PortfolioProject {
  _id?: string;
  title: string;
  description: string;
  projectUrl?: string;
  images: string[];
}

export interface PortfolioFormItem {
  _id?: string;
  title: string;
  description: string;
  projectUrl: string;
  images: string[];
}

export interface DeveloperProfile {
  _id: string;
  user: string;
  bio?: string;
  skills: string[];
  experience?: number;
  hourlyRate?: number;
  availability?: Availability;
  location?: string;
  website?: string;
  avatar?: string;
  portfolio?: PortfolioProject[];
}

export interface ProfileFormData {
  bio?: string;
  skills: string;
  experience: number;
  hourlyRate: number;
  availability: Availability;
}