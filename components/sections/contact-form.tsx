"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { submitContactForm } from "@/lib/actions/contact";
import {
  contactFormInputSchema,
  type ContactFormFields,
  type ContactFormInput,
} from "@/lib/contact/schemas";

const defaultValues: ContactFormFields = {
  name: "",
  email: "",
  message: "",
  website: "",
};

const inputClassName =
  "w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all aria-invalid:border-red-400 aria-invalid:focus:border-red-400 aria-invalid:focus:ring-red-400";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-2 text-sm text-red-400" role="alert">
      {message}
    </p>
  );
}

export function ContactForm({ idPrefix }: { idPrefix: string }) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ContactFormFields, unknown, ContactFormInput>({
    resolver: zodResolver(contactFormInputSchema),
    defaultValues,
    mode: "onBlur",
  });

  const fieldIds = {
    name: `${idPrefix}-name`,
    email: `${idPrefix}-email`,
    message: `${idPrefix}-message`,
    website: `${idPrefix}-website`,
  };
  const errorIds = {
    name: `${fieldIds.name}-error`,
    email: `${fieldIds.email}-error`,
    message: `${fieldIds.message}-error`,
  };

  const submitForm = async (input: ContactFormInput) => {
    setSuccessMessage(null);
    clearErrors("root");

    if (input.website) {
      reset(defaultValues);
      return;
    }

    try {
      const result = await submitContactForm(input);

      if (!result.success) {
        setError("root.server", { type: "server", message: result.message });
        return;
      }

      reset(defaultValues);
      setSuccessMessage(result.message);
    } catch {
      setError("root.server", {
        type: "server",
        message: "Failed to send message. Please try again later.",
      });
    }
  };

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={handleSubmit(submitForm)}
    >
      <div>
        <label htmlFor={fieldIds.name} className="block text-sm font-medium mb-2">
          Name
        </label>
        <input
          {...register("name")}
          id={fieldIds.name}
          autoComplete="name"
          type="text"
          maxLength={100}
          placeholder="Your name..."
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? errorIds.name : undefined}
          className={inputClassName}
        />
        <FieldError id={errorIds.name} message={errors.name?.message} />
      </div>

      <div>
        <label htmlFor={fieldIds.email} className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          {...register("email")}
          id={fieldIds.email}
          autoComplete="email"
          type="email"
          maxLength={254}
          placeholder="your@email.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? errorIds.email : undefined}
          className={inputClassName}
        />
        <FieldError id={errorIds.email} message={errors.email?.message} />
      </div>

      <div>
        <label
          htmlFor={fieldIds.message}
          className="block text-sm font-medium mb-2"
        >
          Message
        </label>
        <textarea
          {...register("message")}
          id={fieldIds.message}
          rows={5}
          maxLength={5000}
          placeholder="Your message..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? errorIds.message : undefined}
          className={`${inputClassName} resize-none`}
        />
        <FieldError id={errorIds.message} message={errors.message?.message} />
      </div>

      <div
        className="absolute -left-2499.75 w-px h-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={fieldIds.website}>Website</label>
        <input
          {...register("website")}
          id={fieldIds.website}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button
        className="w-full"
        type="submit"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>Sending...</>
        ) : (
          <>
            Send Message
            <Send className="w-5 h-5" />
          </>
        )}
      </Button>

      {successMessage && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

      {errors.root?.server?.message && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{errors.root.server.message}</p>
        </div>
      )}
    </form>
  );
}
