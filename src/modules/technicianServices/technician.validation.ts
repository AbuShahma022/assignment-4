import { z } from "zod";

const createTechnicianServiceValidationSchema = z.object({
  body: z.object({
    serviceId: z.string().uuid(),

    price: z
      .number()
      .positive("Price must be greater than 0."),

    description: z
      .string()
      .trim()
      .optional(),
  }),
});

const updateTechnicianServiceValidationSchema = z.object({
  body: z
    .object({
      price: z.number().positive().optional(),
      description: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required.",
    }),
});

export const TechnicianServiceValidation = {
  createTechnicianServiceValidationSchema,
  updateTechnicianServiceValidationSchema
};