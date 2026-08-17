import { describe, expect, it } from "vitest";
import { createLocalPublishedPortfolio } from "../data/local-content-adapter";
import { createPortfolioThemeStyle } from "./theme";

describe("portfolio theme styles", () => {
  it("maps validated theme tokens to scoped CSS variables", async () => {
    const snapshot = await createLocalPublishedPortfolio();
    const style = createPortfolioThemeStyle(snapshot.theme);

    expect(style["--color-primary"]).toBe(snapshot.theme.primaryColor);
    expect(style["--color-background"]).toBe(snapshot.theme.backgroundColor);
    expect(style["--radius"]).toBe("0.75rem");
    expect(style["--portfolio-section-spacing-desktop"]).toBe("8rem");
  });
});
