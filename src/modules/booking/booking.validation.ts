import { z } from "zod";

const createBookingValidationSchema = z.object({
  body: z.object({
    technicianServiceId: z.string().uuid(),

    availabilityId: z.string().uuid(),

    address: z
      .string()
      .trim()
      .min(5),

    problemDescription: z
      .string()
      .trim()
      .optional(),
  }),
});

export const BookingValidation = {
  createBookingValidationSchema,
};