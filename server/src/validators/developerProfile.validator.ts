import { z } from "zod";

const portfolioProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Project title must be at least 2 characters")
    .max(100, "Project title must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Project description must be at least 10 characters")
    .max(1000, "Project description must not exceed 1000 characters"),

  projectUrl: z
    .string()
    .trim()
    .url("Project URL must be a valid URL")
    .optional(),
});

export const createDeveloperProfileSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(2000, "Bio must not exceed 2000 characters")
    .optional(),

  skills: z
    .array(z.string().trim().min(1))
    .min(1, "Add at least one skill")
    .max(30, "You can have a maximum of 30 skills"),

  experience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years")
    .optional(),

  hourlyRate: z
    .number()
    .min(0, "Hourly rate cannot be negative")
    .optional(),

  availability: z
    .enum(["available", "busy", "unavailable"])
    .optional(),

  portfolio: z
    .array(portfolioProjectSchema)
    .max(20, "You can have a maximum of 20 portfolio projects")
    .optional(),
});

export const updateDeveloperProfileSchema =
  createDeveloperProfileSchema.partial();