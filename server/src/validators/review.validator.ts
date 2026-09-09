import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().refine(
  (value) => mongoose.Types.ObjectId.isValid(value),
  {
    message: "Invalid ID",
  },
);

export const createReviewSchema = z.object({
  reviewee: objectIdSchema,

  job: objectIdSchema,

  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must not exceed 5"),

  comment: z
    .string()
    .trim()
    .min(1, "Comment is required")
    .max(
      2000,
      "Comment must not exceed 2000 characters",
    ),
});

export type CreateReviewInput = z.infer<
  typeof createReviewSchema
>;
