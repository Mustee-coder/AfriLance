import { z } from "zod";

export const updateProfileSchema = z.object({
bio: z
.string()
.trim()
.max(1000, "Bio must not exceed 1000 characters")
.optional(),

skills: z
.array(z.string().trim().min(1))
.max(30, "You can have a maximum of 30 skills")
.optional(),

experience: z
.string()
.trim()
.max(2000, "Experience must not exceed 2000 characters")
.optional(),

hourlyRate: z
.number()
.min(0, "Hourly rate cannot be negative")
.optional(),

companyName: z
.string()
.trim()
.max(100, "Company name must not exceed 100 characters")
.optional(),

companyDescription: z
.string()
.trim()
.max(2000, "Company description must not exceed 2000 characters")
.optional(),

location: z
.string()
.trim()
.max(100, "Location must not exceed 100 characters")
.optional(),

website: z
.string()
.trim()
.url("Please provide a valid website URL")
.optional(),

avatar: z
.string()
.trim()
.url("Please provide a valid avatar URL")
.optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;