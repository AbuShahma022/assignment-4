import { log } from "node:console";
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

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address."),

    password: z
      .string()
      .min(1, "Password is required."),
  }),
});


export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema
};
