import { z } from "zod";

const createServiceValidationSchema = z.object({
  body: z.object({
    categoryId: z
      .string()
      .uuid("Invalid category id."),

    name: z
      .string()
      .trim()
      .min(2, "Service name is required.")
      .max(150),

    description: z
      .string()
      .trim()
      .optional(),
  }),
});

export const ServiceValidation = {
  createServiceValidationSchema,
};