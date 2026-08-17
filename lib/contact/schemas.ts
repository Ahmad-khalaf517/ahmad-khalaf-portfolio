import { z } from "zod";

export const contactFormInputSchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  message: z.string().trim().min(1).max(5000),
  website: z.string().trim().max(500),
});

export const emailJsEnvironmentSchema = z.strictObject({
  serviceId: z.string().trim().min(1),
  templateId: z.string().trim().min(1),
  publicKey: z.string().trim().min(1),
  privateKey: z.string().trim().min(1),
});

export type ContactFormInput = z.infer<typeof contactFormInputSchema>;
export type ValidContactMessage = Omit<ContactFormInput, "website">;
