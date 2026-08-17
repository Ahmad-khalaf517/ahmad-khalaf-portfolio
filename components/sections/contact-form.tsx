"use client";

import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { type SubmitEventHandler, useState } from "react";
import { Button } from "@/components/ui/button";
import { submitContactForm } from "@/lib/actions/contact";

export function ContactForm({ idPrefix }: { idPrefix: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [website, setWebsite] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const fieldIds = {
    name: `${idPrefix}-name`,
    email: `${idPrefix}-email`,
    message: `${idPrefix}-message`,
    website: `${idPrefix}-website`,
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (website) {
      setFormData({ name: "", email: "", message: "" });
      return;
    }

    setIsLoading(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const result = await submitContactForm({ ...formData, website });

      setSubmitStatus({
        type: result.success ? "success" : "error",
        message: result.message,
      });

      if (result.success) {
        setFormData({ name: "", email: "", message: "" });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor={fieldIds.name} className="block text-sm font-medium mb-2">
          Name
        </label>
        <input
          id={fieldIds.name}
          autoComplete="name"
          type="text"
          required
          placeholder="Your name..."
          value={formData.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
          className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>

      <div>
        <label htmlFor={fieldIds.email} className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id={fieldIds.email}
          autoComplete="email"
          type="email"
          required
          placeholder="your@email.com"
          value={formData.email}
          onChange={(event) =>
            setFormData({ ...formData, email: event.target.value })
          }
          className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>

      <div>
        <label
          htmlFor={fieldIds.message}
          className="block text-sm font-medium mb-2"
        >
          Message
        </label>
        <textarea
          id={fieldIds.message}
          rows={5}
          required
          value={formData.message}
          onChange={(event) =>
            setFormData({ ...formData, message: event.target.value })
          }
          placeholder="Your message..."
          className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
        />
      </div>

      <div
        className="absolute -left-2499.75 w-px h-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={fieldIds.website}>Website</label>
        <input
          id={fieldIds.website}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <Button
        className="w-full"
        type="submit"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>Sending...</>
        ) : (
          <>
            Send Message
            <Send className="w-5 h-5" />
          </>
        )}
      </Button>

      {submitStatus.type && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl ${
            submitStatus.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
          role="status"
          aria-live="polite"
        >
          {submitStatus.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <p className="text-sm">{submitStatus.message}</p>
        </div>
      )}
    </form>
  );
}
