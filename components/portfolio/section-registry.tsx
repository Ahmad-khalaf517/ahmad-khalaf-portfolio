import type { ReactNode } from "react";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Experience from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import HireMe from "@/components/sections/hire-me";
import Projects from "@/components/sections/projects";
import type {
  PublishedPortfolioSnapshot,
  PublishedSection,
  PublishedSectionKind,
  PublishedSectionOfKind,
} from "@/lib/portfolio/schemas";

type SectionRegistry = {
  [TKind in PublishedSectionKind]: (
    section: PublishedSectionOfKind<TKind>,
    snapshot: PublishedPortfolioSnapshot,
  ) => ReactNode;
};

export const sectionRegistry = {
  hero: (section, snapshot) => (
    <Hero
      sectionId={section.id}
      content={section.content}
      technologies={section.technologies}
      identity={snapshot.identity}
    />
  ),
  about: (section) => (
    <About sectionId={section.id} content={section.content} />
  ),
  experience: (section) => (
    <Experience sectionId={section.id} content={section.content} />
  ),
  projects: (section) => (
    <Projects sectionId={section.id} content={section.content} />
  ),
  "hire-me": (section) => (
    <HireMe sectionId={section.id} content={section.content} />
  ),
  contact: (section) => (
    <Contact sectionId={section.id} content={section.content} />
  ),
} satisfies SectionRegistry;

export function renderPublishedSection(
  section: PublishedSection,
  snapshot: PublishedPortfolioSnapshot,
): ReactNode {
  switch (section.kind) {
    case "hero":
      return sectionRegistry.hero(section, snapshot);
    case "about":
      return sectionRegistry.about(section);
    case "experience":
      return sectionRegistry.experience(section);
    case "projects":
      return sectionRegistry.projects(section);
    case "hire-me":
      return sectionRegistry["hire-me"](section);
    case "contact":
      return sectionRegistry.contact(section);
  }
}
