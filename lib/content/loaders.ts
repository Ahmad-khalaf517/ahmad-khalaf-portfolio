import heroData from "@/content/hero.json";
import aboutData from "@/content/about.json";
import experienceData from "@/content/experience.json";
import projectsData from "@/content/projects.json";
import technologiesData from "@/content/technologies.json";
import hireMeData from "@/content/hire-me.json";
import contactData from "@/content/contact.json";
import type {
  HeroContent,
  AboutContent,
  ExperienceContent,
  ProjectsContent,
  TechnologyItem,
  HireMeContent,
  ContactContent,
} from "@/lib/content/types";

/**
 * These loaders read local JSON today. Once the content dashboard lands
 * (see docs/DASHBOARD_PLAN.md), only the internals here change to query the
 * database — every call site can stay exactly as it is.
 */

export async function getHeroContent(): Promise<HeroContent> {
  return heroData as HeroContent;
}

export async function getAboutContent(): Promise<AboutContent> {
  return aboutData as AboutContent;
}

export async function getExperienceContent(): Promise<ExperienceContent> {
  return experienceData as ExperienceContent;
}

export async function getProjectsContent(): Promise<ProjectsContent> {
  return projectsData;
}

export async function getTechnologies(): Promise<TechnologyItem[]> {
  return technologiesData as TechnologyItem[];
}

export async function getHireMeContent(): Promise<HireMeContent> {
  return hireMeData as HireMeContent;
}

export async function getContactContent(): Promise<ContactContent> {
  return contactData as ContactContent;
}
