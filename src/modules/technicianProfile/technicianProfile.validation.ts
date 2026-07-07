import { z } from "zod";

const createTechnicianProfileValidationSchema = z.object({
  body: z.object({
    bio: z
      .string()
      .trim()
      .min(2)
      .optional(),

    experienceYears: z
      .number()
      .int()
      .min(0),

    location: z.object({
      country: z.string().trim().min(2),
      division: z.string().trim().min(2),
      district: z.string().trim().min(2),
      area: z.string().trim().min(2),
      postalCode: z.string().trim().optional(),
    }),
  }),
});

export const TechnicianProfileValidation = {
  createTechnicianProfileValidationSchema,
};