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

export const TechnicianServiceValidation = {
  createTechnicianServiceValidationSchema,
};