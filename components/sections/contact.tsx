import { Mail, MapPin } from "lucide-react";
import { type ComponentType, type SVGProps } from "react";
import { siWhatsapp } from "simple-icons";
import Section from "../app/section";
import SectionContent from "../app/section-content";
import SectionHeading from "../app/section-heading";
import { ContactForm } from "@/components/sections/contact-form";
import type { ContactIconKey } from "@/lib/content/types";
import type { PublishedSectionOfKind } from "@/lib/portfolio/schemas";

type ContactIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const contactIcons: Record<ContactIconKey, ContactIconComponent> = {
  mail: Mail as ContactIconComponent,
  whatsapp: (({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label="WhatsApp"
      className={className}
      {...props}
    >
      <path d={siWhatsapp.path} />
    </svg>
  )) as ContactIconComponent,
  "map-pin": MapPin as ContactIconComponent,
};

export default function Contact({
  content,
  sectionId = "contact",
}: {
  content: PublishedSectionOfKind<"contact">["content"];
  sectionId?: string;
}) {
  return (
    <Section id={sectionId}>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      </div>

      <SectionContent>
        <SectionHeading header={content.header} align="center" />

        <div className="w-full flex flex-col justify-center items-center lg:flex-row gap-10 max-w-5xl animate-fade-in animation-delay-300">
          <div className="w-full glass p-8 rounded-3xl border border-primary/30 animate-fade-in animation-delay-300 flex-1 max-w-md lg:self-stretch">
            <ContactForm idPrefix={sectionId} />
          </div>

          <div className="w-full space-y-6 animate-fade-in animation-delay-400 flex-1 max-w-md">
            <div className="glass rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-6">
                Contact Information
              </h3>
              <div className="space-y flex flex-col gap-2 max-w-full">
                {content.info.map((item) => {
                  const Icon = contactIcons[item.icon];

                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface transition-colors group border border-border/50"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm text-muted-foreground">
                          {item.label}
                        </div>
                        <div title={item.value} className="font-medium truncate">
                          {item.value}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

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
