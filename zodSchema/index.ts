import * as z from "zod";

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
