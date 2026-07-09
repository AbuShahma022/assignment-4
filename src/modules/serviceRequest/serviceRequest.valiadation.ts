import { z } from "zod";

const createServiceRequestValidationSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid(),
    requestedServiceName: z
      .string()
      .min(2)
      .max(150),
    description: z.string().optional(),
  }),
});

const rejectServiceRequestValidationSchema = z.object({
  body: z.object({
    adminFeedback: z.string().min(5),
  }),
});

export const serviceRequestValidation = {
  createServiceRequestValidationSchema,
  rejectServiceRequestValidationSchema,
};