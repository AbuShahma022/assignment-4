import { z } from "zod";

const createBookingValidationSchema = z.object({
  body: z.object({
    technicianServiceId: z.string().uuid(),

    availabilityId: z.string().uuid(),

    scheduledAt: z.string().datetime(),

    address: z
      .string()
      .trim()
      .min(5)
      .max(255),

    problemDescription: z
      .string()
      .trim()
      .optional(),
  }),
});

export const BookingValidation = {
  createBookingValidationSchema,
};