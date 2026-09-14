import { z } from "zod";

export const profileSchema = z.object({
  bio: z
    .string()
    .max(2000, "Bio must not exceed 2000 characters")
    .optional(),

  skills: z
    .string()
    .min(1, "Add at least one skill"),

  experience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),

  hourlyRate: z
    .number()
    .min(0, "Hourly rate cannot be negative"),

  availability: z.enum([
    "available",
    "busy",
    "unavailable",
  ]),
});
