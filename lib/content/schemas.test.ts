import { describe, expect, it } from "vitest";
import aboutData from "../../content/about.json";
import contactData from "../../content/contact.json";
import experienceData from "../../content/experience.json";
import heroData from "../../content/hero.json";
import hireMeData from "../../content/hire-me.json";
import projectsData from "../../content/projects.json";
import technologiesData from "../../content/technologies.json";
import {
  aboutContentSchema,
  contactContentSchema,
  experienceContentSchema,
  heroContentSchema,
  hireMeContentSchema,
  projectsContentSchema,
  technologiesSchema,
} from "./schemas";

describe("portfolio content schemas", () => {
  it.each([
    ["hero", heroContentSchema, heroData],
    ["about", aboutContentSchema, aboutData],
    ["experience", experienceContentSchema, experienceData],
    ["projects", projectsContentSchema, projectsData],
    ["technologies", technologiesSchema, technologiesData],
    ["hire me", hireMeContentSchema, hireMeData],
    ["contact", contactContentSchema, contactData],
  ])("accepts the current %s content", (_name, schema, content) => {
    expect(schema.safeParse(content).success).toBe(true);
  });

  it("rejects unknown icon keys", () => {
    const result = technologiesSchema.safeParse([
      { name: "Unknown", icon: "not-a-supported-icon" },
    ]);

    expect(result.success).toBe(false);
  });

  it("rejects unsafe links", () => {
    const result = hireMeContentSchema.safeParse({
      ...hireMeData,
      ctaHref: "javascript:alert('unsafe')",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unrecognized fields", () => {
    const result = heroContentSchema.safeParse({
      ...heroData,
      unexpectedField: "should not be accepted",
    });

    expect(result.success).toBe(false);
  });
});
