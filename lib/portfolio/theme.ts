import type { CSSProperties } from "react";
import type { ThemeTokens } from "@/lib/portfolio/schemas";

type PortfolioThemeStyle = CSSProperties & {
  "--color-background": string;
  "--color-foreground": string;
  "--color-card": string;
  "--color-primary": string;
  "--color-interactive-accent": string;
  "--color-primary-foreground": string;
  "--color-secondary": string;
  "--color-secondary-foreground": string;
  "--color-muted": string;
  "--color-muted-foreground": string;
  "--color-border": string;
  "--color-highlight": string;
  "--color-heading-accent": string;
  "--color-surface": string;
  "--radius": string;
  "--portfolio-content-padding": string;
  "--portfolio-section-spacing": string;
  "--portfolio-section-spacing-desktop": string;
};

const fontFamilies: Record<ThemeTokens["fontPreset"], string> = {
  modern: "var(--font-geist-sans), sans-serif",
  technical: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  editorial: 'Georgia, "Times New Roman", serif',
};

const radii: Record<ThemeTokens["radiusPreset"], string> = {
  sharp: "0.25rem",
  medium: "0.75rem",
  rounded: "1.25rem",
};

const density: Record<
  ThemeTokens["densityPreset"],
  Pick<
    PortfolioThemeStyle,
    | "--portfolio-content-padding"
    | "--portfolio-section-spacing"
    | "--portfolio-section-spacing-desktop"
  >
> = {
  compact: {
    "--portfolio-content-padding": "1rem",
    "--portfolio-section-spacing": "4rem",
    "--portfolio-section-spacing-desktop": "6rem",
  },
  comfortable: {
    "--portfolio-content-padding": "1.5rem",
    "--portfolio-section-spacing": "5rem",
    "--portfolio-section-spacing-desktop": "8rem",
  },
};

export function createPortfolioThemeStyle(
  tokens: ThemeTokens,
): PortfolioThemeStyle {
  return {
    "--color-background": tokens.backgroundColor,
    "--color-foreground": tokens.foregroundColor,
    "--color-card": tokens.cardColor,
    "--color-primary": tokens.primaryColor,
    "--color-interactive-accent": tokens.interactiveAccentColor,
    "--color-primary-foreground": tokens.primaryForegroundColor,
    "--color-secondary": tokens.secondaryColor,
    "--color-secondary-foreground": tokens.primaryColor,
    "--color-muted": tokens.mutedColor,
    "--color-muted-foreground": tokens.mutedForegroundColor,
    "--color-border": tokens.borderColor,
    "--color-highlight": tokens.highlightColor,
    "--color-heading-accent": tokens.headingAccentColor,
    "--color-surface": tokens.surfaceColor,
    "--radius": radii[tokens.radiusPreset],
    ...density[tokens.densityPreset],
    fontFamily: fontFamilies[tokens.fontPreset],
  };
}
