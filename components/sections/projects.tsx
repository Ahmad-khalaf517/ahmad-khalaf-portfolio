import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Github from "@/assets/icons/github";
import Section from "../app/section";
import SectionContent from "../app/section-content";
import SectionHeading from "../app/section-heading";
import { TiltCard } from "@/components/ui/tilt-card";
import type { PublishedSectionOfKind } from "@/lib/portfolio/schemas";

export default function Projects({
  content,
  sectionId = "projects",
}: {
  content: PublishedSectionOfKind<"projects">["content"];
  sectionId?: string;
}) {
  return (
    <Section id={sectionId}>
      {/* Bg glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      <SectionContent>
        {/* Section Header */}
        <SectionHeading header={content.header} align="center" />

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {content.items.map((project, idx) => (
            <TiltCard
              key={project.id}
              className="group glass rounded-2xl overflow-hidden animate-fade-in md:row-span-1"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-video">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={400}
                  sizes="(min-width: 1280px) 600px, (min-width: 768px) calc(50vw - 48px), calc(100vw - 48px)"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-focus-within:scale-110"
                />
                <div
                  className="absolute inset-0
                bg-linear-to-t from-card via-card/50
                 to-transparent opacity-60"
                />
                {/* Overlay Links — always visible on mobile (no hover there), hover-revealed on desktop */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity duration-300">
                 {project.link && (
                   <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} live`}
                    className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card transition-all"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                 )}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} source on GitHub`}
                    className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card transition-all"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold group-hover:text-primary group-focus-within:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <ArrowUpRight
                    className="w-5 h-5
                  text-muted-foreground group-hover:text-primary group-focus-within:text-primary
                   group-hover:translate-x-1
                   group-hover:-translate-y-1 group-focus-within:translate-x-1
                   group-focus-within:-translate-y-1 transition-all"
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-4 py-1.5 rounded-full bg-surface text-xs font-medium border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </SectionContent>
    </Section>
  );
};
