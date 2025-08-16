import { z } from "zod";

export const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code")
});

export type OtpValues = z.infer<typeof otpSchema>;