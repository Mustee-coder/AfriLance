import { z } from "zod";

export const reviewSchema = z.object({
rating: z
.number()
.int()
.min(1, "Please select a rating")
.max(5, "Rating cannot be more than 5"),

comment: z
.string()
.trim()
.min(1, "Please write a review")
.max(1000, "Review cannot exceed 1000 characters"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;