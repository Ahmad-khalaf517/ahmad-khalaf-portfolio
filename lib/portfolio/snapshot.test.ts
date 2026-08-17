import { describe, expect, it } from "vitest";
import { createLocalPublishedPortfolio } from "../data/local-content-adapter";
import { publishedPortfolioSnapshotSchema } from "./schemas";
import { getRequiredPublishedSection } from "./sections";

describe("published portfolio snapshot", () => {
  it("builds a valid snapshot from the current local content", async () => {
    const snapshot = await createLocalPublishedPortfolio();

    expect(publishedPortfolioSnapshotSchema.safeParse(snapshot).success).toBe(true);
    expect(snapshot.schemaVersion).toBe(1);
    expect(snapshot.portfolio.slug).toBe("full-stack");
  });

  it("provides stable IDs and unique positions for rendered sections", async () => {
    const snapshot = await createLocalPublishedPortfolio();
    const ids = snapshot.sections.map((section) => section.id);
    const positions = snapshot.sections.map((section) => section.position);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(positions).size).toBe(positions.length);
    expect(positions).toEqual([...positions].sort((left, right) => left - right));
  });

  it("returns a correctly narrowed required section", async () => {
    const snapshot = await createLocalPublishedPortfolio();
    const hero = getRequiredPublishedSection(snapshot, "hero");

    expect(hero.kind).toBe("hero");
    expect(hero.technologies.length).toBeGreaterThan(0);
  });

  it("rejects duplicate section positions", async () => {
    const snapshot = await createLocalPublishedPortfolio();
    const duplicatePosition = {
      ...snapshot,
      sections: snapshot.sections.map((section, index) =>
        index === 1 ? { ...section, position: 0 } : section,
      ),
    };

    expect(publishedPortfolioSnapshotSchema.safeParse(duplicatePosition).success).toBe(
      false,
    );
  });
});
