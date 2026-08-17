import { describe, expect, it } from "vitest";
import { publishedSectionKinds } from "@/lib/portfolio/schemas";
import { sectionRegistry } from "./section-registry";

describe("published section registry", () => {
  it("has a renderer for every published section kind", () => {
    expect(Object.keys(sectionRegistry).sort()).toEqual(
      [...publishedSectionKinds].sort(),
    );
  });
});
