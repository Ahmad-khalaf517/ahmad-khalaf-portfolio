import {
  ShieldCheck,
  Users,
  Code2,
  HeartHandshake,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import Section from "../app/section";
import SectionContent from "../app/section-content";
import type { HireMeIconKey } from "@/lib/content/types";
import type { PublishedSectionOfKind } from "@/lib/portfolio/schemas";

const valueIcons: Record<HireMeIconKey, typeof Code2> = {
  code: Code2,
  users: Users,
  shield: ShieldCheck,
  "heart-handshake": HeartHandshake,
};

export default function WhyHireMe({
  content,
  sectionId = "hire-me",
}: {
  content: PublishedSectionOfKind<"hire-me">["content"];
  sectionId?: string;
}) {
  return (
    <Section
      id={sectionId}
      className="relative py-16! md:py-24! border-t border-border"
    >
      <SectionContent className="space-y-10 md:space-y-16 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-(--color-primary) font-semibold text-xs uppercase tracking-widest mb-3 bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] px-3 py-1 rounded-full border border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]">
            <Zap className="h-3.5 w-3.5" /> {content.badgeLabel}
          </div>
          <h2 className="text-3xl md:text-5xl font-normal tracking-tight leading-tight mb-6">
            {content.heading}{" "}
            <span className="text-(--color-primary) font-medium">
              {content.headingAccent}
            </span>
            .
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed animate-fade-in">
            {content.description}
          </p>
        </div>

        {/* 2x2 Grid Layout for Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {content.values.map((item, index) => {
            const Icon = valueIcons[item.icon];
            return (
              <div
                key={item.id}
                className="glass p-6 md:p-8 rounded-(--radius) border border-border group animate-fade-in transition-all duration-300 hover:border-(--color-primary)/40 hover:-translate-y-1 shadow-sm hover:shadow-[0_16px_45px_color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
                style={{ animationDelay: `${150 + index * 80}ms` }}
              >
                <div className="flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary border border-border group-hover:border-(--color-primary)/30 group-hover:bg-primary/10 transition-all duration-300">
                    <Icon className="h-5 w-5 text-(--color-primary) transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Impact Statement & Call to Action Box */}
        <div className="glass-strong rounded-2xl border border-border glow-border animate-fade-in animation-delay-300 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl space-y-2">
            <h4 className="text-lg font-medium text-foreground">
              {content.ctaHeading}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {content.ctaDescription}
            </p>
          </div>
          <a
            href={content.ctaHref}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-(--color-primary) text-primary-foreground text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-90 shadow-[0_0_15px_color-mix(in_srgb,var(--color-primary)_30%,transparent)] group"
          >
            {content.ctaLabel}
            <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </SectionContent>
    </Section>
  );
}
