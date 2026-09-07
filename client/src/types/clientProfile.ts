import { z } from "zod";

export interface ClientProfileUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "client";
}

export interface ClientProfile {
  _id: string;
  user: string | ClientProfileUser;
  companyName?: string;
  companyDescription?: string;
  industry?: string;
  website?: string;
  country?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
}

export const clientProfileSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),

  companyDescription: z
    .string()
    .trim()
    .max(
      2000,
      "Company description must not exceed 2000 characters",
    ),

  industry: z
    .string()
    .trim()
    .max(
      100,
      "Industry must not exceed 100 characters",
    ),

  website: z
    .string()
    .trim()
    .url("Please enter a valid website URL")
    .or(z.literal("")),

  country: z
    .string()
    .trim()
    .max(
      100,
      "Country must not exceed 100 characters",
    ),

  city: z
    .string()
    .trim()
    .max(
      100,
      "City must not exceed 100 characters",
    ),
});

export type ClientProfileFormData = z.infer<
  typeof clientProfileSchema
>;

export interface ClientProfileResponse {
  success: boolean;
  profile: ClientProfile;
}

export interface ClientProfileMutationResponse {
  success: boolean;
  message: string;
  profile: ClientProfile;
}