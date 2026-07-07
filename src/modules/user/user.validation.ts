import {z} from "zod";
const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),

    email: z.string().trim().email("Invalid email address."),

    password: z.string().min(5),

    phone: z.string().optional(),

    profileImage: z.url().optional(),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(3)
        
        .optional(),

      phone: z
        .string()
        .trim()
        .optional(),

      profileImage: z
        .string()
        .trim()
        .url()
        .optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      {
        message: "At least one field is required to update.",
      }
    ),
});

const updateUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "BLOCKED"]),
  }),
});


export const UserValidation = {
  registerValidationSchema,
  updateProfileValidationSchema,
  updateUserStatusValidationSchema
};