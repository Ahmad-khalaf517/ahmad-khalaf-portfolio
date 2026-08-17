"use client";

import { useScrollFill } from "@/hooks/useScrollFill";
import type { PublishedSectionOfKind } from "@/lib/portfolio/schemas";

type ExperienceItem = PublishedSectionOfKind<"experience">["content"]["items"][number];

function TimelineRow({
  experience,
  index,
  reached,
}: {
  experience: ExperienceItem;
  index: number;
  reached: boolean;
}) {
  return (
    <div className="relative grid md:grid-cols-2 gap-8">
      <div
        className={`absolute left-0 md:left-1/2 top-0 w-3 h-3 bg-primary rounded-full -translate-x-1/2 ring-4 ring-background z-10 transition-all duration-500 ease-out ${
          reached ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        {experience.current && (
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
        )}
      </div>

      <div
        className={`pl-8 md:pl-0 transition-all duration-700 ease-out ${
          reached ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } ${index % 2 === 0 ? "md:pr-16" : "md:col-start-2 md:pl-16"}`}
      >
        <div
          className={`glass p-6 rounded-2xl border border-primary/30 hover:border-primary/50 transition-all duration-500 ${
            experience.current ? "animate-card-glow" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-primary font-medium">
              {experience.period}
            </span>
            {experience.current && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary shrink-0">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Active
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold mt-2">{experience.role}</h3>
          <p className="text-muted-foreground">{experience.company}</p>
          <p className="text-sm text-muted-foreground mt-4">
            {experience.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {experience.technologies.map((technology, technologyIndex) => (
              <span
                key={`${experience.id}-${technology}-${technologyIndex}`}
                className="px-3 py-1 bg-surface text-xs rounded-full text-muted-foreground"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  const { ref: timelineRef, progress } = useScrollFill<HTMLDivElement>();

  return (
    <div ref={timelineRef} className="relative">
      <div
        className="absolute left-0 md:left-1/2 top-0 w-0.5 md:-translate-x-1/2 origin-top rounded-full bg-linear-to-b from-primary via-primary to-primary/60 shadow-[0_0_10px_rgba(32,178,166,0.8)]"
        style={{ height: "100%", transform: `scaleY(${progress})` }}
      />

      <div className="space-y-12">
        {items.map((experience, index) => (
          <TimelineRow
            key={experience.id}
            experience={experience}
            index={index}
            reached={progress > index / items.length}
          />
        ))}
      </div>
    </div>
  );
}
