"use client";

import Section from "../app/section";
import SectionContent from "../app/section-content";
import SectionTitle from "../app/section-title";
import { useScrollFill } from "@/hooks/useScrollFill";
import type { ExperienceContent, ExperienceItem } from "@/lib/content/types";

function TimelineRow({ exp, idx }: { exp: ExperienceItem; idx: number }) {
  // Same continuous, position-based check the line itself uses (see
  // hooks/useScrollFill.ts) rather than a one-shot IntersectionObserver —
  // so scrolling back up above the row un-reveals it again instead of the
  // reveal being permanent.
  const { ref, progress: rowProgress } = useScrollFill<HTMLDivElement>();
  const reached = rowProgress > 0;

  return (
    <div ref={ref} className="relative grid md:grid-cols-2 gap-8">
      {/* Timeline Dot — pops in once the fill line reaches it */}
      <div
        className={`absolute left-0 md:left-1/2 top-0 w-3 h-3 bg-primary rounded-full -translate-x-1/2 ring-4 ring-background z-10 transition-all duration-500 ease-out ${
          reached ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        {exp.current && (
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
        )}
      </div>

      {/* Content */}
      <div
        className={`pl-8 md:pl-0 transition-all duration-700 ease-out ${
          reached ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } ${
          idx % 2 === 0 ? "md:pr-16 md:text-right" : "md:col-start-2 md:pl-16"
        }`}
      >
        <div
          className={`glass p-6 rounded-2xl border border-primary/30 hover:border-primary/50 transition-all duration-500 ${
            exp.current ? "animate-card-glow" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-primary font-medium">{exp.period}</span>
            {exp.current && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary shrink-0">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Active
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold mt-2">{exp.role}</h3>
          <p className="text-muted-foreground">{exp.company}</p>
          <p className="text-sm text-muted-foreground mt-4">{exp.description}</p>
          <div
            className={`flex flex-wrap gap-2 mt-4 ${
              idx % 2 === 0 ? "md:justify-end" : ""
            }`}
          >
            {exp.technologies.map((tech, techIdx) => (
              <span
                key={techIdx}
                className="px-3 py-1 bg-surface text-xs rounded-full text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience({ content }: { content: ExperienceContent }) {
  const { ref: timelineRef, progress } = useScrollFill<HTMLDivElement>();

  return (
    <Section id="experience">
      <div
        className="absolute top-1/2 left-1/4 w-96
       h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"
      />

      <SectionContent className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <SectionTitle title={content.header.eyebrow} />
          <h2
            className="text-4xl md:text-5xl font-bold
           mt-4 mb-6 animate-fade-in animation-delay-100
            text-secondary-foreground"
          >
            {content.header.heading}{" "}
            <span className="font-serif italic font-normal text-white">
              {" "}
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

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Line — invisible until scrolled to, grows to match scroll position */}
          <div
            className="absolute left-0 md:left-1/2 top-0 w-0.5 md:-translate-x-1/2 origin-top rounded-full bg-linear-to-b from-primary via-primary to-primary/60 shadow-[0_0_10px_rgba(32,178,166,0.8)]"
            style={{ height: "100%", transform: `scaleY(${progress})` }}
          />

          {/* Experience Items */}
          <div className="space-y-12">
            {content.items.map((exp, idx) => (
              <TimelineRow key={idx} exp={exp} idx={idx} />
            ))}
          </div>
        </div>
      </SectionContent>
    </Section>
  );
}
