import {
  getAboutContent,
  getContactContent,
  getExperienceContent,
  getHeroContent,
  getHireMeContent,
  getProjectsContent,
  getTechnologies,
} from "@/lib/content/loaders";
import {
  publishedPortfolioSnapshotSchema,
  type PublishedPortfolioSnapshot,
} from "@/lib/portfolio/schemas";

function createLocalId(prefix: string, value: string, index: number): string {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${prefix}-${slug || index + 1}`;
}

export async function createLocalPublishedPortfolio(): Promise<PublishedPortfolioSnapshot> {
  const [hero, about, experience, projects, technologies, hireMe, contact] =
    await Promise.all([
      getHeroContent(),
      getAboutContent(),
      getExperienceContent(),
      getProjectsContent(),
      getTechnologies(),
      getHireMeContent(),
      getContactContent(),
    ]);

  return publishedPortfolioSnapshotSchema.parse({
    schemaVersion: 1,
    portfolio: {
      id: "local-default-portfolio",
      name: "Full Stack Portfolio",
      slug: "full-stack",
      isDefault: true,
    },
    seo: {
      title: "Ahmad Khalaf - Software Engineer",
      description:
        "Ahmad Khalaf is a software engineer specializing in React, Next.js, and TypeScript. With a passion for crafting scalable and performant web applications, Ahmad has a proven track record of delivering high-quality solutions that users love. Explore Ahmad's portfolio to see his work and experience in action.",
      image: hero.profileImage,
    },
    theme: {
      primaryColor: "#20b2a6",
      backgroundColor: "#0f1418",
      surfaceColor: "#1a2329",
      foregroundColor: "#f0f2f5",
      mutedForegroundColor: "#929ca7",
      fontPreset: "modern",
      radiusPreset: "medium",
      densityPreset: "comfortable",
      motionPreset: "expressive",
    },
    sections: [
      {
        id: "section-hero",
        kind: "hero",
        enabled: true,
        position: 0,
        navigationLabel: "Home",
        content: hero,
        technologies: technologies.map((technology, index) => ({
          ...technology,
          id: createLocalId("technology", technology.name, index),
        })),
      },
      {
        id: "section-about",
        kind: "about",
        enabled: true,
        position: 1,
        navigationLabel: "About",
        content: {
          ...about,
          highlights: about.highlights.map((highlight, index) => ({
            ...highlight,
            id: createLocalId("about-highlight", highlight.title, index),
          })),
        },
      },
      {
        id: "section-experience",
        kind: "experience",
        enabled: true,
        position: 2,
        navigationLabel: "Experience",
        content: {
          ...experience,
          items: experience.items.map((item, index) => ({
            ...item,
            id: createLocalId("experience", `${item.company}-${item.role}`, index),
          })),
        },
      },
      {
        id: "section-projects",
        kind: "projects",
        enabled: true,
        position: 3,
        navigationLabel: "Projects",
        content: {
          ...projects,
          items: projects.items.map((item, index) => ({
            ...item,
            id: createLocalId("project", item.title, index),
          })),
        },
      },
      {
        id: "section-hire-me",
        kind: "hire-me",
        enabled: true,
        position: 4,
        navigationLabel: "Hire Me",
        content: {
          ...hireMe,
          values: hireMe.values.map((value, index) => ({
            ...value,
            id: createLocalId("hire-me-value", value.title, index),
          })),
        },
      },
      {
        id: "section-contact",
        kind: "contact",
        enabled: true,
        position: 5,
        navigationLabel: "Contact",
        content: {
          ...contact,
          info: contact.info.map((item, index) => ({
            ...item,
            id: createLocalId("contact-info", item.label, index),
          })),
        },
      },
    ],
  });
}
