import { z } from "zod";

// Registration schema based on the Mongoose user model
export const registerSchema = z.object({
  userId: z.string({
    required_error: "User ID is required",
  }),
  name: z
    .string({
      required_error: "Name is required",
    })
    .trim(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    })
    .trim(),
  mobile: z
    .string({
      required_error: "Mobile number is required",
    })
    .regex(/^\d{10}$/, {
      message: "Mobile number must be a valid 10-digit number",
    })
    .trim(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 6 characters",
    }),
});

// Login schema using userId and password
export const loginSchema = z.object({
  userId: z.string({
    required_error: "User ID is required",
  }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 6 characters",
    }),
});
