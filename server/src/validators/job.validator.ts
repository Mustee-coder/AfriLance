import { z } from "zod";

export const createJobSchema = z.object({
title: z
.string()
.trim()
.min(5, "Title must be at least 5 characters")
.max(150, "Title must not exceed 150 characters"),

description: z
.string()
.trim()
.min(20, "Description must be at least 20 characters")
.max(5000, "Description must not exceed 5000 characters"),

skills: z
.array(z.string().trim().min(1))
.min(1, "At least one skill is required")
.max(20, "You can add a maximum of 20 skills"),

budget: z
.number()
.positive("Budget must be greater than 0"),

budgetType: z.enum(["fixed", "hourly"]),

experienceLevel: z.enum([
"entry",
"intermediate",
"expert",
]),

deadline: z
.coerce
.date()
.refine(
(date) => date > new Date(),
"Deadline must be in the future",
)
.optional(),
locationType: z.enum(["remote", "onsite", "hybrid"]),

country: z
  .string()
  .trim()
  .min(2, "Country is required")
  .max(100),

city: z
  .string()
  .trim()
  .min(2, "City is required")
  .max(100),
});

export const updateJobSchema = z.object({
title: z
.string()
.trim()
.min(5)
.max(150)
.optional(),

description: z
.string()
.trim()
.min(20)
.max(5000)
.optional(),

skills: z
.array(z.string().trim().min(1))
.max(20)
.optional(),

budget: z
.number()
.positive()
.optional(),

budgetType: z
.enum(["fixed", "hourly"])
.optional(),

experienceLevel: z
.enum(["entry", "intermediate", "expert"])
.optional(),

deadline: z
.coerce
.date()
.refine(
(date) => date > new Date(),
"Deadline must be in the future",
)
.optional(),

status: z
.enum(["open", "in_progress", "completed", "cancelled"])
.optional(),
locationType: z
  .enum(["remote", "onsite", "hybrid"])
  .optional(),

country: z
  .string()
  .trim()
  .min(2)
  .max(100)
  .optional(),

city: z
  .string()
  .trim()
  .min(2)
  .max(100)
  .optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
