import { z } from "zod";

/**
 * Zod schema for product review validation
 * Matches DummyJSON API response structure
 */
export const ReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string(),
  date: z.string(), // ISO8601 date string
  reviewerName: z.string(),
  reviewerEmail: z.string().email(),
});

export type Review = z.infer<typeof ReviewSchema>;
