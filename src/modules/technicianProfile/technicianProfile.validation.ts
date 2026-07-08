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

const updateTechnicianProfileValidationSchema = z.object({
  body: z
    .object({
      bio: z.string().trim().max(500).optional(),

      experienceYears: z.number().int().min(0).optional(),

      location: z
        .object({
          country: z.string().trim().optional(),
          division: z.string().trim().optional(),
          district: z.string().trim().optional(),
          area: z.string().trim().optional(),
          postalCode: z.string().trim().optional(),
        })
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required.",
    }),
});


export const TechnicianProfileValidation = {
  createTechnicianProfileValidationSchema,
  updateTechnicianProfileValidationSchema
};