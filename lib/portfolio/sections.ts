import type {
  PublishedPortfolioSnapshot,
  PublishedSectionKind,
  PublishedSectionOfKind,
} from "@/lib/portfolio/schemas";

export function getPublishedSection<TKind extends PublishedSectionKind>(
  snapshot: PublishedPortfolioSnapshot,
  kind: TKind,
): PublishedSectionOfKind<TKind> | undefined {
  return snapshot.sections.find(
    (section): section is PublishedSectionOfKind<TKind> => section.kind === kind,
  );
}

export function getRequiredPublishedSection<TKind extends PublishedSectionKind>(
  snapshot: PublishedPortfolioSnapshot,
  kind: TKind,
): PublishedSectionOfKind<TKind> {
  const section = getPublishedSection(snapshot, kind);

  if (!section) {
    throw new Error(
      `Published portfolio "${snapshot.portfolio.slug}" is missing its ${kind} section.`,
    );
  }

  return section;
}
