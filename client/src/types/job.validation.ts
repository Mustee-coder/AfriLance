import { z } from "zod";

export const postJobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Job title must be at least 5 characters")
    .max(150, "Job title must not exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must not exceed 5000 characters"),

  budget: z
    .number()
    .positive("Budget must be greater than 0"),

  budgetType: z.enum(["fixed", "hourly"]),

  experienceLevel: z.enum([
    "entry",
    "intermediate",
    "expert",
  ]),

  deadline: z.string().optional(),

  locationType: z.enum([
    "remote",
    "onsite",
    "hybrid",
  ]),

  country: z
    .string()
    .trim()
    .min(2, "Country is required")
    .max(100, "Country must not exceed 100 characters"),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100, "City must not exceed 100 characters"),
});

export type PostJobFormData = z.infer<typeof postJobSchema>;
