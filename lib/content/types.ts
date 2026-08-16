export interface SectionHeader {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  description: string;
}

export interface SocialLink {
  platform: "github" | "linkedin";
  href: string;
}

export interface HeroContent {
  badgeText: string;
  name: string;
  headlinePrefix: string;
  headlineHighlight: string;
  headlineMiddle: string;
  headlineAccent: string;
  subtext: string;
  resumeUrl: string;
  yearsExperience: string;
  yearsLabel: string;
  availabilityText: string;
  profileImage: string;
  socialLinks: SocialLink[];
}

export type AboutIconKey = "code" | "rocket" | "users" | "lightbulb";

export interface AboutHighlight {
  icon: AboutIconKey;
  title: string;
  description: string;
}

export interface AboutContent {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  paragraphs: string[];
  quote: string;
  highlights: AboutHighlight[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
  current: boolean;
}

export interface ExperienceContent {
  header: SectionHeader;
  items: ExperienceItem[];
}

export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github: string;
}

export interface ProjectsContent {
  header: SectionHeader;
  items: ProjectItem[];
  ctaLabel: string;
}

export type TechIconKey =
  | "react"
  | "nextjs"
  | "typescript"
  | "nodejs"
  | "postgresql"
  | "docker"
  | "vercel"
  | "tailwindcss"
  | "prisma"
  | "figma"
  | "git"
  | "githubactions";

export interface TechnologyItem {
  name: string;
  icon: TechIconKey;
}

export type HireMeIconKey = "code" | "users" | "shield" | "heart-handshake";

export interface HireMeValue {
  icon: HireMeIconKey;
  title: string;
  description: string;
}

export interface HireMeContent {
  badgeLabel: string;
  heading: string;
  headingAccent: string;
  description: string;
  values: HireMeValue[];
  ctaHeading: string;
  ctaDescription: string;
  ctaLabel: string;
  ctaHref: string;
}

export type ContactIconKey = "mail" | "whatsapp" | "map-pin";

export interface ContactInfoItem {
  icon: ContactIconKey;
  label: string;
  value: string;
  href: string;
}

export interface ContactContent {
  header: SectionHeader;
  info: ContactInfoItem[];
  availabilityTitle: string;
  availabilityDescription: string;
}
