import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name is required."),
     

    description: z
      .string()
      .trim()
      .optional(),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Category name is required.")
      
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

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema
};