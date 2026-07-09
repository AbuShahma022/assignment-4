import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

export const reviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};