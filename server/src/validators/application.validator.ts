import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),

  coverLetter: z
    .string()
    .trim()
    .min(20, "Cover letter must be at least 20 characters")
    .max(5000, "Cover letter must not exceed 5000 characters"),

  bidAmount: z
    .number()
    .positive("Bid amount must be greater than 0"),

  estimatedDays: z
    .number()
    .int("Estimated days must be a whole number")
    .positive("Estimated days must be greater than 0"),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});
