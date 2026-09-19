import { z } from "zod";

export const generateJobSchema = z.object({
  idea: z
    .string()
    .trim()
    .min(10, "Job idea must be at least 10 characters")
    .max(2000, "Job idea must not exceed 2000 characters"),
});

export const aiJobDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5)
    .max(150),

  description: z
    .string()
    .trim()
    .min(20)
    .max(5000),

  skills: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(20),

  experienceLevel: z.enum([
    "entry",
    "intermediate",
    "expert",
  ]),

  requirements: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(10),

  deliverables: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(10),
});

export type GenerateJobInput = z.infer<
  typeof generateJobSchema
>;

export type AIJobDraft = z.infer<
  typeof aiJobDraftSchema
>;


export const extractJobRequirementsSchema = z.object({
  idea: z
    .string()
    .trim()
    .min(10, "Job idea must be at least 10 characters")
    .max(2000, "Job idea must not exceed 2000 characters"),
});

export const aiRequirementsSchema = z.object({
  skills: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(20),

  requirements: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(15),
});

export type ExtractJobRequirementsInput = z.infer<
  typeof extractJobRequirementsSchema
>;

export type AIRequirements = z.infer<
  typeof aiRequirementsSchema
>;



export const improveCVSchema = z.object({
  headline: z
    .string()
    .trim()
    .max(150)
    .optional(),

  professionalSummary: z
    .string()
    .trim()
    .max(2000)
    .optional(),

  skills: z
    .array(z.string().trim().min(1))
    .max(30),

  experience: z
    .array(
      z.object({
        company: z.string().trim().min(1).max(100),
        position: z.string().trim().min(1).max(100),
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        current: z.boolean(),
        description: z.string().trim().max(2000).optional(),
      }),
    )
    .max(20),

  projects: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(150),
        description: z.string().trim().max(2000),
        projectUrl: z.string().trim().max(500).optional(),
      }),
    )
    .max(20),

  education: z
    .array(
      z.object({
        institution: z.string().trim().min(1).max(150),
        degree: z.string().trim().min(1).max(150),
        fieldOfStudy: z.string().trim().max(150).optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        description: z.string().trim().max(2000).optional(),
      }),
    )
    .max(10),

  certifications: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(150),
        issuer: z.string().trim().min(1).max(150),
        issueDate: z.coerce.date().optional(),
        credentialUrl: z.string().trim().max(500).optional(),
      }),
    )
    .max(20),
});

export type AICVImprovement = z.infer<
  typeof improveCVSchema
>;
