import { z } from "zod";

const createAvailabilityValidationSchema = z.object({
  body: z.object({
    dayOfWeek: z.enum([
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ]),

  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  }),
});

const updateAvailabilityValidationSchema = z.object({
  body: z
    .object({
      dayOfWeek: z
        .enum([
          "SUNDAY",
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
        ])
        .optional(),

      startTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .optional(),

      endTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required.",
    }),
});

export const AvailabilityValidation = {
  createAvailabilityValidationSchema,
  updateAvailabilityValidationSchema,
};