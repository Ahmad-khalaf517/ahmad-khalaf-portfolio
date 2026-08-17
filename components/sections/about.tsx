import { Code2, Lightbulb, Rocket, Users } from "lucide-react";
import Section from "../app/section";
import SectionContent from "../app/section-content";
import SectionTitle from "../app/section-title";
import type { AboutIconKey } from "@/lib/content/types";
import type { PublishedSectionOfKind } from "@/lib/portfolio/schemas";

const highlightIcons: Record<AboutIconKey, typeof Code2> = {
  code: Code2,
  rocket: Rocket,
  users: Users,
  lightbulb: Lightbulb,
};

export default function AboutMe({
  content,
  sectionId = "about",
}: {
  content: PublishedSectionOfKind<"about">["content"];
  sectionId?: string;
}) {
  return (
    <Section id={sectionId}>
      <SectionContent>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div>
            <SectionTitle title={content.eyebrow} />

            <h2 className="text-4xl md:text-5xl font-bold leading-tight mt-8 animate-fade-in animation-delay-100 text-secondary-foreground">
              {content.heading}
              <span className="font-serif italic font-normal text-[var(--color-heading-accent)]">
                {" "}
                {content.headingAccent}
              </span>
            </h2>

            <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200 mt-8">
              {content.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300 mt-8">
              <p className="text-lg font-medium italic text-foreground">
                &quot;{content.quote}&quot;
              </p>
            </div>
          </div>

          {/* Right Column - Hilights */}
          <div className="grid sm:grid-cols-2 gap-6">
            {content.highlights.map((item, idx) => {
              const Icon = highlightIcons[item.icon];
              return (
                <div
                  key={item.id}
                  className="glass p-6 rounded-2xl animate-fade-in group transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_45px_color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
                  style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
                    <Icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:-rotate-3" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </SectionContent>
    </Section>
  );
}
