import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";
import { getPortfolioNavigation } from "@/lib/portfolio/rendering";
import type { PublishedPortfolioSnapshot } from "@/lib/portfolio/schemas";
import { createPortfolioThemeStyle } from "@/lib/portfolio/theme";

export function PublishedPortfolioPage({
  snapshot,
}: {
  snapshot: PublishedPortfolioSnapshot;
}) {
  const navigation = getPortfolioNavigation(snapshot);
  const themeStyle = createPortfolioThemeStyle(snapshot.theme);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-background text-foreground"
      data-font-preset={snapshot.theme.fontPreset}
      data-density-preset={snapshot.theme.densityPreset}
      data-motion-preset={snapshot.theme.motionPreset}
      style={themeStyle}
    >
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
