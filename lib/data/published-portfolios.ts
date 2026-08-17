import "server-only";

import { createLocalPublishedPortfolio } from "@/lib/data/local-content-adapter";
import { portfolioSlugSchema } from "@/lib/portfolio/schemas";

const localPublishedPortfolio = createLocalPublishedPortfolio();

export async function getDefaultPublishedPortfolio() {
  return localPublishedPortfolio;
}

export async function getPublishedPortfolioBySlug(slug: string) {
  const parsedSlug = portfolioSlugSchema.safeParse(slug);

  if (!parsedSlug.success) {
    return null;
  }

  const portfolio = await localPublishedPortfolio;
  return portfolio.portfolio.slug === parsedSlug.data ? portfolio : null;
}

export async function getPublishedPortfolioSlugs() {
  const portfolio = await localPublishedPortfolio;
  return [portfolio.portfolio.slug];
}
