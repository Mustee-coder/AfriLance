import { z } from "zod";

const experienceSchema = z.object({
  company: z.string().trim().min(1).max(100),
  position: z.string().trim().min(1).max(100),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  current: z.boolean().default(false),
  description: z.string().trim().max(2000).optional(),
});

const educationSchema = z.object({
  institution: z.string().trim().min(1).max(150),
  degree: z.string().trim().min(1).max(100),
  fieldOfStudy: z.string().trim().max(100).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  description: z.string().trim().max(1000).optional(),
});

const projectSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(1000),
  projectUrl: z.string().trim().url().max(500).optional(),
});

const certificationSchema = z.object({
  name: z.string().trim().min(1).max(150),
  issuer: z.string().trim().min(1).max(150),
  issueDate: z.coerce.date().optional(),
  credentialUrl: z.string().trim().url().max(500).optional(),
});

export const createResumeSchema = z.object({
  headline: z.string().trim().max(150).optional(),

  professionalSummary: z.string().trim().max(2000).optional(),

  skills: z.array(
    z.string().trim().min(1).max(100),
  ).max(30).default([]),

  experience: z.array(experienceSchema).max(20).default([]),

  education: z.array(educationSchema).max(10).default([]),

  projects: z.array(projectSchema).max(20).default([]),

  certifications: z.array(certificationSchema).max(20).default([]),

  template: z.enum([
    "classic",
    "modern",
    "minimal",
  ]).default("classic"),
});

export const updateResumeSchema =
  createResumeSchema.partial();
