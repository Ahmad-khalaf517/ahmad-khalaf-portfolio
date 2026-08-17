import { describe, expect, it } from "vitest";
import { createLocalPublishedPortfolio } from "../data/local-content-adapter";
import { createPortfolioMetadata } from "./metadata";

describe("portfolio metadata", () => {
  it("derives SEO and canonical metadata from the published snapshot", async () => {
    const snapshot = await createLocalPublishedPortfolio();
    const metadata = createPortfolioMetadata(snapshot, "/p/full-stack");

    expect(metadata.title).toBe(snapshot.seo.title);
    expect(metadata.description).toBe(snapshot.seo.description);
    expect(metadata.alternates?.canonical).toBe("/p/full-stack");
    expect(metadata.openGraph).toMatchObject({
      title: snapshot.seo.title,
      description: snapshot.seo.description,
    });
  });
});
