"use client";

import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitEventHandler, useState } from "react";
import SectionTitle from "../app/section-title";
import SectionContent from "../app/section-content";
import Section from "../app/section";
import type { ContactContent, ContactIconKey } from "@/lib/content/types";

const contactIcons: Record<ContactIconKey, typeof Mail> = {
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
};

export default function Contact({ content }: { content: ContactContent }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [website, setWebsite] = useState(""); // honeypot: real users never fill this
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (website) {
      // Bot filled the hidden field — silently drop without hitting EmailJS.
      setFormData({ name: "", email: "", message: "" });
      return;
    }

    setIsLoading(true);
    setSubmitStatus({ type: null, message: "" });
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          "EmailJS configuration is missing. Please check your environment variables.",
        );
      }

      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        publicKey,
      );

      setSubmitStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      console.error("EmailJS error:", err);
      setSubmitStatus({
        type: "error",
        message:
          (err as { text?: string }).text || "Failed to send message. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Section id="contact">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      </div>

      <SectionContent>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionTitle title={content.header.eyebrow} />
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            {content.header.heading}{" "}
            <span className="font-serif italic font-normal text-white">
              {content.header.headingAccent}
            </span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            {content.header.description}
          </p>
        </div>

        <div className="w-full flex flex-col justify-center items-center lg:flex-row gap-10 max-w-5xl animate-fade-in animation-delay-300">
          <div className="w-full glass p-8 rounded-3xl border border-primary/30 animate-fade-in animation-delay-300 flex-1 max-w-md lg:self-stretch">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Your name..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Your message..."
                  className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              {/* Honeypot field — hidden from real users, bots tend to fill every field */}
              <div className="absolute -left-2499.75 w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
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
                  className={`flex items-center gap-3
                     p-4 rounded-xl ${
                       submitStatus.type === "success"
                         ? "bg-green-500/10 border border-green-500/20 text-green-400"
                         : "bg-red-500/10 border border-red-500/20 text-red-400"
                     }`}
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
          </div>

          {/* Contact Info */}
          <div className="w-full space-y-6 animate-fade-in animation-delay-400 flex-1 max-w-md">
            <div className="glass rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-6">
                Contact Information
              </h3>
              <div className="space-y flex flex-col gap-2 max-w-full">
                {content.info.map((item, i) => {
                  const Icon = contactIcons[item.icon];
                  return (
                    <a
                      key={i}
                      href={item.href}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface transition-colors group border border-border/50"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm text-muted-foreground">
                          {item.label}
                        </div>
                        <div title={item.value} className="font-medium truncate">{item.value}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Availability Card */}
            <div className="glass rounded-3xl p-8 border border-primary/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">{content.availabilityTitle}</span>
              </div>
              <p className="text-muted-foreground text-sm">
                {content.availabilityDescription}
              </p>
            </div>
          </div>
        </div>
      </SectionContent>
    </Section>
  );
}
