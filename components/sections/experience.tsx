import Section from "../app/section";
import SectionContent from "../app/section-content";
import SectionTitle from "../app/section-title";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import type { PublishedSectionOfKind } from "@/lib/portfolio/schemas";

export default function Experience({
  content,
  sectionId = "experience",
}: {
  content: PublishedSectionOfKind<"experience">["content"];
  sectionId?: string;
}) {
  return (
    <Section id={sectionId}>
      <div
        className="absolute top-1/2 left-1/4 w-96
       h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"
      />

      <SectionContent className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <SectionTitle title={content.header.eyebrow} />
          <h2
            className="text-4xl md:text-5xl font-bold
           mt-4 mb-6 animate-fade-in animation-delay-100
            text-secondary-foreground"
          >
            {content.header.heading}{" "}
            <span className="font-serif italic font-normal text-white">
              {content.header.headingAccent}
            </span>
          </h2>

          <p
            className="text-muted-foreground
           animate-fade-in animation-delay-200"
          >
            {content.header.description}
          </p>
        </div>

        <ExperienceTimeline items={content.items} />
      </SectionContent>
    </Section>
  );
}
