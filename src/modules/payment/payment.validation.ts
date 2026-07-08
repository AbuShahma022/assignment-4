import { z } from "zod";

const createCheckoutSessionValidationSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
  }),
});

export const paymentValidation = {
  createCheckoutSessionValidationSchema,
};