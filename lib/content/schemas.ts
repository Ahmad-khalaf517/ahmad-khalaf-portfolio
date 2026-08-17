import { z } from "zod";

const requiredText = (maxLength: number) =>
  z.string().trim().min(1).max(maxLength);

const webUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => /^https?:\/\//i.test(value), {
    message: "URL must use HTTP or HTTPS.",
  });

const assetUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
    { message: "Asset URL must be an absolute site path or HTTP(S) URL." },
  );

const safeHrefSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine(
    (value) =>
      value.startsWith("/") ||
      value.startsWith("#") ||
      /^(https?:|mailto:|tel:)/i.test(value),
    { message: "Link uses an unsupported or unsafe protocol." },
  );

export const sectionHeaderSchema = z.strictObject({
  eyebrow: requiredText(100),
  heading: requiredText(200),
  headingAccent: requiredText(200),
  description: requiredText(1000),
});

export const socialLinkSchema = z.strictObject({
  platform: z.enum(["github", "linkedin"]),
  href: webUrlSchema,
});

export const heroContentSchema = z.strictObject({
  badgeText: requiredText(150),
  name: requiredText(150),
  headlinePrefix: requiredText(200),
  headlineHighlight: requiredText(200),
  headlineMiddle: requiredText(200),
  headlineAccent: requiredText(200),
  subtext: requiredText(1500),
  resumeUrl: assetUrlSchema,
  yearsExperience: requiredText(20),
  yearsLabel: requiredText(100),
  availabilityText: requiredText(200),
  profileImage: assetUrlSchema,
  socialLinks: z.array(socialLinkSchema).min(1).max(10),
});

export const aboutIconKeySchema = z.enum([
  "code",
  "rocket",
  "users",
  "lightbulb",
]);

export const aboutHighlightSchema = z.strictObject({
  icon: aboutIconKeySchema,
  title: requiredText(150),
  description: requiredText(1000),
});

export const aboutContentSchema = z.strictObject({
  eyebrow: requiredText(100),
  heading: requiredText(200),
  headingAccent: requiredText(200),
  paragraphs: z.array(requiredText(3000)).min(1).max(20),
  quote: requiredText(2000),
  highlights: z.array(aboutHighlightSchema).min(1).max(12),
});

export const experienceItemSchema = z.strictObject({
  period: requiredText(100),
  role: requiredText(200),
  company: requiredText(200),
  description: requiredText(3000),
  technologies: z.array(requiredText(100)).max(50),
  current: z.boolean(),
});

export const experienceContentSchema = z.strictObject({
  header: sectionHeaderSchema,
  items: z.array(experienceItemSchema).min(1).max(50),
});

export const projectItemSchema = z.strictObject({
  title: requiredText(200),
  description: requiredText(3000),
  image: assetUrlSchema,
  tags: z.array(requiredText(100)).max(50),
  link: webUrlSchema.optional(),
  github: webUrlSchema,
});

export const projectsContentSchema = z.strictObject({
  header: sectionHeaderSchema,
  items: z.array(projectItemSchema).min(1).max(100),
  ctaLabel: requiredText(150),
});

export const techIconKeySchema = z.enum([
  "react",
  "nextjs",
  "typescript",
  "nodejs",
  "postgresql",
  "docker",
  "vercel",
  "tailwindcss",
  "prisma",
  "figma",
  "git",
  "githubactions",
]);

export const technologyItemSchema = z.strictObject({
  name: requiredText(100),
  icon: techIconKeySchema,
});

export const technologiesSchema = z
  .array(technologyItemSchema)
  .min(1)
  .max(100);

export const hireMeIconKeySchema = z.enum([
  "code",
  "users",
  "shield",
  "heart-handshake",
]);

export const hireMeValueSchema = z.strictObject({
  icon: hireMeIconKeySchema,
  title: requiredText(200),
  description: requiredText(2000),
});

export const hireMeContentSchema = z.strictObject({
  badgeLabel: requiredText(100),
  heading: requiredText(200),
  headingAccent: requiredText(200),
  description: requiredText(3000),
  values: z.array(hireMeValueSchema).min(1).max(12),
  ctaHeading: requiredText(300),
  ctaDescription: requiredText(2000),
  ctaLabel: requiredText(150),
  ctaHref: safeHrefSchema,
});

export const contactIconKeySchema = z.enum(["mail", "whatsapp", "map-pin"]);

export const contactInfoItemSchema = z.strictObject({
  icon: contactIconKeySchema,
  label: requiredText(100),
  value: requiredText(500),
  href: safeHrefSchema,
});

export const contactContentSchema = z.strictObject({
  header: sectionHeaderSchema,
  info: z.array(contactInfoItemSchema).min(1).max(20),
  availabilityTitle: requiredText(200),
  availabilityDescription: requiredText(2000),
});

export function parseContent<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
  source: string,
): z.output<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new Error(
      `Invalid portfolio content in ${source}:\n${z.prettifyError(result.error)}`,
      { cause: result.error },
    );
  }

  return result.data;
}

export type SectionHeader = z.infer<typeof sectionHeaderSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type HeroContent = z.infer<typeof heroContentSchema>;
export type AboutIconKey = z.infer<typeof aboutIconKeySchema>;
export type AboutHighlight = z.infer<typeof aboutHighlightSchema>;
export type AboutContent = z.infer<typeof aboutContentSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type ExperienceContent = z.infer<typeof experienceContentSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type ProjectsContent = z.infer<typeof projectsContentSchema>;
export type TechIconKey = z.infer<typeof techIconKeySchema>;
export type TechnologyItem = z.infer<typeof technologyItemSchema>;
export type HireMeIconKey = z.infer<typeof hireMeIconKeySchema>;
export type HireMeValue = z.infer<typeof hireMeValueSchema>;
export type HireMeContent = z.infer<typeof hireMeContentSchema>;
export type ContactIconKey = z.infer<typeof contactIconKeySchema>;
export type ContactInfoItem = z.infer<typeof contactInfoItemSchema>;
export type ContactContent = z.infer<typeof contactContentSchema>;
