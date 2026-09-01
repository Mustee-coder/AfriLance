import { z } from "zod";

export const registerSchema = z.object({
firstName: z
.string()
.trim()
.min(2, "First name must be at least 2 characters")
.max(50, "First name must not exceed 50 characters"),

lastName: z
.string()
.trim()
.min(2, "Last name must be at least 2 characters")
.max(50, "Last name must not exceed 50 characters"),

email: z
.string()
.trim()
.email("Please provide a valid email address")
.transform((email) => email.toLowerCase()),

password: z
.string()
.min(6, "Password must be at least 6 characters")
.max(100, "Password must not exceed 100 characters"),

role: z.enum(["developer", "client"]).default("developer"),
});

export const loginSchema = z.object({
email: z
.string()
.trim()
.email("Please provide a valid email address")
.transform((email) => email.toLowerCase()),

password: z
.string()
.min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
