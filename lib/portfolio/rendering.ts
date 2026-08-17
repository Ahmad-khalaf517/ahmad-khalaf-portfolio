import type {
  PublishedPortfolioSnapshot,
  PublishedSection,
} from "@/lib/portfolio/schemas";

export function getRenderableSections(
  snapshot: PublishedPortfolioSnapshot,
): PublishedSection[] {
  return snapshot.sections
    .filter((section) => section.enabled)
    .toSorted((left, right) => left.position - right.position);
}
