import {
  emailJsEnvironmentSchema,
  type ValidContactMessage,
} from "@/lib/contact/schemas";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const REQUEST_TIMEOUT_MS = 10_000;

function getEmailJsEnvironment() {
  return emailJsEnvironmentSchema.safeParse({
    serviceId: process.env.EMAILJS_SERVICE_ID,
    templateId: process.env.EMAILJS_TEMPLATE_ID,
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
  });
}

export async function sendContactEmail(
  message: ValidContactMessage,
): Promise<boolean> {
  const environment = getEmailJsEnvironment();

  if (!environment.success) {
    console.error("EmailJS server configuration is missing or invalid.");
    return false;
  }

  const { serviceId, templateId, publicKey, privateKey } = environment.data;

  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: message,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error("EmailJS request failed with status:", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "EmailJS request failed:",
      error instanceof Error ? error.name : "Unknown error",
    );
    return false;
  }
}
