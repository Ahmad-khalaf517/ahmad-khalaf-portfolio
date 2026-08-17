import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";
import { getDefaultPublishedPortfolio } from "@/lib/data/published-portfolios";
import { getRequiredPublishedSection } from "@/lib/portfolio/sections";

export default async function Home() {
  const portfolio = await getDefaultPublishedPortfolio();
  const hero = getRequiredPublishedSection(portfolio, "hero");

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header resumeUrl={hero.content.resumeUrl} />
      <PortfolioRenderer snapshot={portfolio} />
      <Footer />
    </div>
  );
}
