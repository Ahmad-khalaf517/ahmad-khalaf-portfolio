import TechIcon from "@/assets/icons/tech-icon";
import type { TechnologyItem } from "@/lib/content/types";
import { TechMarqueeClient } from "./tech-marquee-client";

const REPEAT = 3;

export function TechMarquee({ technologies }: { technologies: TechnologyItem[] }) {
  return (
    <TechMarqueeClient>
      {Array.from({ length: REPEAT }).flatMap((_, copyIndex) =>
        technologies.map((tech) => (
          <div
            key={`${copyIndex}-${tech.name}`}
            aria-hidden={copyIndex === 0 ? undefined : true}
            className="shrink-0 flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full glass"
          >
            <TechIcon
              icon={tech.icon}
              className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
            />
            <span className="text-sm sm:text-lg font-medium text-muted-foreground whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        )),
      )}
    </TechMarqueeClient>
  );
}
