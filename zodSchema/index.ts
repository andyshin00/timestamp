import * as z from "zod";

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export const videoRequestSchema = z.object({
  youtubeUrl: z.string(),
});

export const timestampsSchema = z.object({
  timestamps: z.array(
    z.object({
      time: z.number(),
      label: z.string(),
    }),
  ),
});
