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

const updateServiceValidationSchema = z.object({
  body: z
    .object({
      categoryId: z
        .string()
        .uuid("Invalid category id.")
        .optional(),

      name: z
        .string()
        .trim()
        .min(2, "Service name is required.")
        .max(150)
        .optional(),

      description: z
        .string()
        .trim()
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required.",
    }),
});

export const ServiceValidation = {
  createServiceValidationSchema,
  updateServiceValidationSchema
};