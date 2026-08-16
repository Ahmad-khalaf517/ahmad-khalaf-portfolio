"use server";

interface ContactFormInput {
  name: string;
  email: string;
  message: string;
  website: string; // honeypot — real users never fill this
}

interface ContactFormResult {
  success: boolean;
  message: string;
}

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(
  input: ContactFormInput,
): Promise<ContactFormResult> {
  // Bots tend to fill every field, including ones hidden from real users.
  // Report success without sending so they don't learn to avoid this field.
  if (input.website) {
    return {
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    };
  }

  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name || !email || !message) {
    return { success: false, message: "Please fill in all fields." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.error("EmailJS server configuration is missing.");
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }

  try {
    const res = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: { name, email, message },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("EmailJS request failed:", res.status, text);
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
      };
    }

    return {
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    };
  } catch (err) {
    console.error("EmailJS request error:", err);
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }
}
