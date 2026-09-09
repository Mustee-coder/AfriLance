import { z } from "zod";

export const createPortfolioSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Portfolio title is required")
    .max(100, "Portfolio title must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(
      500,
      "Portfolio description must not exceed 500 characters",
    )
    .optional(),
});

export type CreatePortfolioInput = z.infer<
  typeof createPortfolioSchema
>;
