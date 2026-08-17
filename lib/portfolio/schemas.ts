import { z } from "zod";
import {
  aboutContentSchema,
  aboutHighlightSchema,
  contactContentSchema,
  contactInfoItemSchema,
  experienceContentSchema,
  experienceItemSchema,
  heroContentSchema,
  hireMeContentSchema,
  hireMeValueSchema,
  projectItemSchema,
  projectsContentSchema,
  technologyItemSchema,
} from "@/lib/content/schemas";

export const entityIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[a-z0-9][a-z0-9_-]*$/i, "ID contains unsupported characters.");

export const portfolioSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase kebab-case.");

const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-f]{6}$/i, "Color must be a six-digit hex value.");

export const themeTokensSchema = z.strictObject({
  primaryColor: hexColorSchema,
  backgroundColor: hexColorSchema,
  surfaceColor: hexColorSchema,
  foregroundColor: hexColorSchema,
  mutedForegroundColor: hexColorSchema,
  fontPreset: z.enum(["modern", "technical", "editorial"]),
  radiusPreset: z.enum(["sharp", "medium", "rounded"]),
  densityPreset: z.enum(["compact", "comfortable"]),
  motionPreset: z.enum(["minimal", "balanced", "expressive"]),
});

const publishedExperienceContentSchema = experienceContentSchema.extend({
  items: z.array(experienceItemSchema.extend({ id: entityIdSchema })).min(1).max(50),
});

const publishedProjectsContentSchema = projectsContentSchema.extend({
  items: z.array(projectItemSchema.extend({ id: entityIdSchema })).min(1).max(100),
});

const publishedAboutContentSchema = aboutContentSchema.extend({
  highlights: z
    .array(aboutHighlightSchema.extend({ id: entityIdSchema }))
    .min(1)
    .max(12),
});

const publishedHireMeContentSchema = hireMeContentSchema.extend({
  values: z
    .array(hireMeValueSchema.extend({ id: entityIdSchema }))
    .min(1)
    .max(12),
});

const publishedContactContentSchema = contactContentSchema.extend({
  info: z
    .array(contactInfoItemSchema.extend({ id: entityIdSchema }))
    .min(1)
    .max(20),
});

const publishedTechnologiesSchema = z
  .array(technologyItemSchema.extend({ id: entityIdSchema }))
  .min(1)
  .max(100);

const sectionBaseShape = {
  id: entityIdSchema,
  enabled: z.boolean(),
  position: z.number().int().nonnegative(),
  navigationLabel: z.string().trim().min(1).max(100),
};

export const heroSectionSchema = z.strictObject({
  ...sectionBaseShape,
  kind: z.literal("hero"),
  content: heroContentSchema,
  technologies: publishedTechnologiesSchema,
});

export const aboutSectionSchema = z.strictObject({
  ...sectionBaseShape,
  kind: z.literal("about"),
  content: publishedAboutContentSchema,
});

export const experienceSectionSchema = z.strictObject({
  ...sectionBaseShape,
  kind: z.literal("experience"),
  content: publishedExperienceContentSchema,
});

export const projectsSectionSchema = z.strictObject({
  ...sectionBaseShape,
  kind: z.literal("projects"),
  content: publishedProjectsContentSchema,
});

export const hireMeSectionSchema = z.strictObject({
  ...sectionBaseShape,
  kind: z.literal("hire-me"),
  content: publishedHireMeContentSchema,
});

export const contactSectionSchema = z.strictObject({
  ...sectionBaseShape,
  kind: z.literal("contact"),
  content: publishedContactContentSchema,
});

export const publishedSectionSchema = z.discriminatedUnion("kind", [
  heroSectionSchema,
  aboutSectionSchema,
  experienceSectionSchema,
  projectsSectionSchema,
  hireMeSectionSchema,
  contactSectionSchema,
]);

export const publishedSectionKinds = [
  "hero",
  "about",
  "experience",
  "projects",
  "hire-me",
  "contact",
] as const satisfies readonly PublishedSectionKind[];

export const publishedPortfolioSnapshotSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    portfolio: z.strictObject({
      id: entityIdSchema,
      name: z.string().trim().min(1).max(200),
      slug: portfolioSlugSchema,
      isDefault: z.boolean(),
    }),
    seo: z.strictObject({
      title: z.string().trim().min(1).max(200),
      description: z.string().trim().min(1).max(1000),
      image: z.string().trim().min(1).max(2048).optional(),
    }),
    theme: themeTokensSchema,
    sections: z.array(publishedSectionSchema).min(1).max(50),
  })
  .superRefine((snapshot, context) => {
    const sectionIds = new Set<string>();
    const positions = new Set<number>();

    snapshot.sections.forEach((section, index) => {
      if (sectionIds.has(section.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate section ID: ${section.id}`,
          path: ["sections", index, "id"],
        });
      }

      if (positions.has(section.position)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate section position: ${section.position}`,
          path: ["sections", index, "position"],
        });
      }

      sectionIds.add(section.id);
      positions.add(section.position);
    });
  });

export type ThemeTokens = z.infer<typeof themeTokensSchema>;
export type PublishedSection = z.infer<typeof publishedSectionSchema>;
export type PublishedPortfolioSnapshot = z.infer<
  typeof publishedPortfolioSnapshotSchema
>;
export type PublishedSectionKind = PublishedSection["kind"];
export type PublishedSectionOfKind<TKind extends PublishedSectionKind> = Extract<
  PublishedSection,
  { kind: TKind }
>;
