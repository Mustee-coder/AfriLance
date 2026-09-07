



export interface DeveloperDashboardStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}

export interface DeveloperApplicationJob {
  _id: string;
  title: string;
  budget: number;
  budgetType: "fixed" | "hourly";
  status: "open" | "in_progress" | "completed" | "closed";
}

export interface DeveloperApplication {
  _id: string;
  job: DeveloperApplicationJob;
  developer: string;
  coverLetter: string;
  bidAmount: number;
  estimatedDays: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface DeveloperProfile {
  _id: string;
  user: string;
  bio?: string;
  skills: string[];
  experience?: number;
  hourlyRate?: number;
  availability?: string;
  location?: string;
  website?: string;
  avatar?: string;
  portfolio?: {
    title: string;
    description: string;
    projectUrl?: string;
    _id: string;
  }[];
}

export interface DeveloperDashboard {
  profile: DeveloperProfile;
  stats: DeveloperDashboardStats;
  recentApplications: DeveloperApplication[];
}

export interface DeveloperDashboardResponse {
  success: boolean;
  dashboard: DeveloperDashboard;
}


export interface ClientDashboardStats {
  totalJobs: number;
  openJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  totalApplications: number;
}

export interface ClientJob {
  _id: string;
  title: string;
  description: string;
  budget: number;
  budgetType: "fixed" | "hourly";
  skills: string[];
  status: "open" | "in_progress" | "completed" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface ClientApplicationDeveloper {
  _id: string;
  firstName: string;
  lastName: string;
  role: "developer";
}

export interface ClientApplicationJob {
  _id: string;
  title: string;
  budget: number;
  budgetType: "fixed" | "hourly";
}

export interface ClientApplication {
  _id: string;
  job: ClientApplicationJob;
  developer: ClientApplicationDeveloper;
  coverLetter: string;
  bidAmount: number;
  estimatedDays: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfile {
  _id: string;
  user: string;
  companyName?: string;
  companyDescription?: string;
  location?: string;
  website?: string;
  avatar?: string;
}

export interface ClientDashboard {
  profile: ClientProfile;
  stats: ClientDashboardStats;
  recentJobs: ClientJob[];
  recentApplications: ClientApplication[];
}

export interface ClientDashboardResponse {
  success: boolean;
  dashboard: ClientDashboard;
}
