import heroData from "@/content/hero.json";
import aboutData from "@/content/about.json";
import experienceData from "@/content/experience.json";
import projectsData from "@/content/projects.json";
import technologiesData from "@/content/technologies.json";
import hireMeData from "@/content/hire-me.json";
import contactData from "@/content/contact.json";
import {
  aboutContentSchema,
  contactContentSchema,
  experienceContentSchema,
  heroContentSchema,
  hireMeContentSchema,
  parseContent,
  projectsContentSchema,
  technologiesSchema,
} from "@/lib/content/schemas";
import type {
  AboutContent,
  ContactContent,
  ExperienceContent,
  HeroContent,
  HireMeContent,
  ProjectsContent,
  TechnologyItem,
} from "@/lib/content/types";

/**
 * Local JSON remains the temporary content source. Validation happens once
 * when this server module loads, so malformed content fails early instead of
 * reaching a section component with an unsafe type assertion.
 */

const heroContent = parseContent(
  heroContentSchema,
  heroData,
  "content/hero.json",
);
const aboutContent = parseContent(
  aboutContentSchema,
  aboutData,
  "content/about.json",
);
const experienceContent = parseContent(
  experienceContentSchema,
  experienceData,
  "content/experience.json",
);
const projectsContent = parseContent(
  projectsContentSchema,
  projectsData,
  "content/projects.json",
);
const technologies = parseContent(
  technologiesSchema,
  technologiesData,
  "content/technologies.json",
);
const hireMeContent = parseContent(
  hireMeContentSchema,
  hireMeData,
  "content/hire-me.json",
);
const contactContent = parseContent(
  contactContentSchema,
  contactData,
  "content/contact.json",
);

export async function getHeroContent(): Promise<HeroContent> {
  return heroContent;
}

export async function getAboutContent(): Promise<AboutContent> {
  return aboutContent;
}

export async function getExperienceContent(): Promise<ExperienceContent> {
  return experienceContent;
}

export async function getProjectsContent(): Promise<ProjectsContent> {
  return projectsContent;
}

export async function getTechnologies(): Promise<TechnologyItem[]> {
  return technologies;
}

export async function getHireMeContent(): Promise<HireMeContent> {
  return hireMeContent;
}

export async function getContactContent(): Promise<ContactContent> {
  return contactContent;
}
