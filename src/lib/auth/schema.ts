import { z } from "zod";

export const emailPassSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

export const emailPassSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const emailVerifyCodeSchema = z.object({
  code: z.string().length(6),
});
