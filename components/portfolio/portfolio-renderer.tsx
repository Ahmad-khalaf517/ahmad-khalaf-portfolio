import { Fragment } from "react";
import { renderPublishedSection } from "@/components/portfolio/section-registry";
import { getRenderableSections } from "@/lib/portfolio/rendering";
import type { PublishedPortfolioSnapshot } from "@/lib/portfolio/schemas";

export function PortfolioRenderer({
  snapshot,
}: {
  snapshot: PublishedPortfolioSnapshot;
}) {
  const sections = getRenderableSections(snapshot);

  return (
    <main id="main-content" tabIndex={-1}>
      {sections.map((section) => (
        <Fragment key={section.id}>
          {renderPublishedSection(section, snapshot)}
        </Fragment>
      ))}
    </main>
  );
}
