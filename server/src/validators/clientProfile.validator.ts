import { z } from "zod";

export const createClientProfileSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters")
    .optional(),

  companyDescription: z
    .string()
    .trim()
    .max(2000, "Company description must not exceed 2000 characters")
    .optional(),

  industry: z
    .string()
    .trim()
    .max(100, "Industry must not exceed 100 characters")
    .optional(),

  website: z
    .string()
    .trim()
    .url("Website must be a valid URL")
    .optional(),

  country: z
    .string()
    .trim()
    .max(100, "Country must not exceed 100 characters")
    .optional(),

  city: z
    .string()
    .trim()
    .max(100, "City must not exceed 100 characters")
    .optional(),
});

export const updateClientProfileSchema =
  createClientProfileSchema.partial();
