import { z } from "zod";

export const contactFormInputSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email address.")
    .max(254, "Email must be 254 characters or fewer.")
    .email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(1, "Please enter a message.")
    .max(5000, "Message must be 5,000 characters or fewer."),
  website: z.string().trim().max(500),
});

export const emailJsEnvironmentSchema = z.strictObject({
  serviceId: z.string().trim().min(1),
  templateId: z.string().trim().min(1),
  publicKey: z.string().trim().min(1),
  privateKey: z.string().trim().min(1),
});

export type ContactFormFields = z.input<typeof contactFormInputSchema>;
export type ContactFormInput = z.output<typeof contactFormInputSchema>;
export type ValidContactMessage = Omit<ContactFormInput, "website">;
