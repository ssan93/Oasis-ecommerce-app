/* eslint-disable @typescript-eslint/no-empty-object-type */
import { z } from "zod";

export const AuthCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const SignUpSchema = AuthCredentialsSchema.extend({
  confirmPassword: z.string(),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export interface IAuthCredentials
  extends z.infer<typeof AuthCredentialsSchema> {}

export interface ISignUp extends z.infer<typeof SignUpSchema> {}
