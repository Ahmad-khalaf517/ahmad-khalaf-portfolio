import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";
import { getPortfolioNavigation } from "@/lib/portfolio/rendering";
import type { PublishedPortfolioSnapshot } from "@/lib/portfolio/schemas";

export function PublishedPortfolioPage({
  snapshot,
}: {
  snapshot: PublishedPortfolioSnapshot;
}) {
  const navigation = getPortfolioNavigation(snapshot);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header
        resumeUrl={snapshot.identity.resume.url}
        navigation={navigation}
      />
      <PortfolioRenderer snapshot={snapshot} />
      <Footer
        identity={snapshot.identity}
        navigationLinks={navigation.links}
      />
    </div>
  );
}
