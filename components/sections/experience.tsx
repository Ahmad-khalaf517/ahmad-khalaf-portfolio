import Section from "../app/section";
import SectionContent from "../app/section-content";
import SectionHeading from "../app/section-heading";
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
        <SectionHeading header={content.header} />

        <ExperienceTimeline items={content.items} />
      </SectionContent>
    </Section>
  );
}
