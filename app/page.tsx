import type { Metadata } from "next";
import { PublishedPortfolioPage } from "@/components/portfolio/published-portfolio-page";
import { getDefaultPublishedPortfolio } from "@/lib/data/published-portfolios";
import { createPortfolioMetadata } from "@/lib/portfolio/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await getDefaultPublishedPortfolio();
  return createPortfolioMetadata(portfolio, "/");
}

export default async function Home() {
  const portfolio = await getDefaultPublishedPortfolio();
  return <PublishedPortfolioPage snapshot={portfolio} />;
}
