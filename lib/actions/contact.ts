"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { sendContactEmail } from "@/lib/contact/emailjs";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import {
  contactFormInputSchema,
  type ContactFormInput,
} from "@/lib/contact/schemas";

interface ContactFormResult {
  success: boolean;
  message: string;
}

const SUCCESS_MESSAGE =
  "Message sent successfully! I'll get back to you soon.";
const FAILURE_MESSAGE = "Failed to send message. Please try again later.";
const contactRateLimiter = createRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000,
});

async function getRateLimitKey(): Promise<string> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwardedFor || requestHeaders.get("x-real-ip") || "unknown";

  return createHash("sha256").update(address).digest("hex");
}

export async function submitContactForm(
  input: ContactFormInput,
): Promise<ContactFormResult> {
  const parsedInput = contactFormInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Please check the form fields and try again.",
    };
  }

  const { website, ...message } = parsedInput.data;

  if (website) {
    return { success: true, message: SUCCESS_MESSAGE };
  }

  const rateLimit = contactRateLimiter.check(await getRateLimitKey());

  if (!rateLimit.allowed) {
    return {
      success: false,
      message: "Too many messages were submitted. Please try again later.",
    };
  }

  const sent = await sendContactEmail(message);

  return sent
    ? { success: true, message: SUCCESS_MESSAGE }
    : { success: false, message: FAILURE_MESSAGE };
}
