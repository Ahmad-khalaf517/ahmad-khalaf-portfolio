import { describe, expect, it } from "vitest";
import { createLocalPublishedPortfolio } from "../data/local-content-adapter";
import { getPortfolioNavigation, getRenderableSections } from "./rendering";

describe("portfolio rendering order", () => {
  it("sorts enabled sections by their configured position", async () => {
    const snapshot = await createLocalPublishedPortfolio();
    const reordered = {
      ...snapshot,
      sections: snapshot.sections.map((section) => {
        if (section.kind === "about") return { ...section, position: 2 };
        if (section.kind === "experience") return { ...section, position: 1 };
        return section;
      }),
    };

    expect(getRenderableSections(reordered).map((section) => section.kind)).toEqual([
      "hero",
      "experience",
      "about",
      "projects",
      "hire-me",
      "contact",
    ]);
  });

  it("omits disabled sections", async () => {
    const snapshot = await createLocalPublishedPortfolio();
    const withProjectsDisabled = {
      ...snapshot,
      sections: snapshot.sections.map((section) =>
        section.kind === "projects" ? { ...section, enabled: false } : section,
      ),
    };

    expect(
      getRenderableSections(withProjectsDisabled).some(
        (section) => section.kind === "projects",
      ),
    ).toBe(false);
  });

  it("derives navigation from enabled section IDs and labels", async () => {
    const snapshot = await createLocalPublishedPortfolio();
    const navigation = getPortfolioNavigation(snapshot);

    expect(navigation.sectionIds[0]).toBe("hero");
    expect(navigation.links[0]).toEqual({
      id: "about",
      href: "#about",
      label: "About",
    });
    expect(navigation.links.some((link) => link.id === "hero")).toBe(false);
  });
});
