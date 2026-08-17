import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublishedPortfolioPage } from "@/components/portfolio/published-portfolio-page";
import {
  getPublishedPortfolioBySlug,
  getPublishedPortfolioSlugs,
} from "@/lib/data/published-portfolios";
import { createPortfolioMetadata } from "@/lib/portfolio/metadata";

interface PortfolioRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedPortfolioSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PortfolioRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPublishedPortfolioBySlug(slug);

  if (!portfolio) {
    return { title: "Portfolio not found" };
  }

  return createPortfolioMetadata(portfolio, `/p/${portfolio.portfolio.slug}`);
}

export default async function PortfolioBySlug({ params }: PortfolioRouteProps) {
  const { slug } = await params;
  const portfolio = await getPublishedPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  return <PublishedPortfolioPage snapshot={portfolio} />;
}
