import type {
  PublishedPortfolioSnapshot,
  PublishedSection,
} from "@/lib/portfolio/schemas";

export interface PortfolioNavigationLink {
  id: string;
  href: `#${string}`;
  label: string;
}

export interface PortfolioNavigationModel {
  links: PortfolioNavigationLink[];
  sectionIds: string[];
}

export function getRenderableSections(
  snapshot: PublishedPortfolioSnapshot,
): PublishedSection[] {
  return snapshot.sections
    .filter((section) => section.enabled)
    .toSorted((left, right) => left.position - right.position);
}

export function getPortfolioNavigation(
  snapshot: PublishedPortfolioSnapshot,
): PortfolioNavigationModel {
  const sections = getRenderableSections(snapshot);

  return {
    sectionIds: sections.map((section) => section.id),
    links: sections
      .filter((section) => section.kind !== "hero")
      .map((section) => ({
        id: section.id,
        href: `#${section.id}`,
        label: section.navigationLabel,
      })),
  };
}
