import React from "react";
import {
  siReact,
  siNextdotjs,
  siTypescript,
  siNodedotjs,
  siPostgresql,
  siDocker,
  siVercel,
  siTailwindcss,
  siPrisma,
  siFigma,
  siGit,
  siGithubactions,
  type SimpleIcon,
} from "simple-icons";
import type { TechIconKey } from "@/lib/content/types";

const icons: Record<TechIconKey, SimpleIcon> = {
  react: siReact,
  nextjs: siNextdotjs,
  typescript: siTypescript,
  nodejs: siNodedotjs,
  postgresql: siPostgresql,
  docker: siDocker,
  vercel: siVercel,
  tailwindcss: siTailwindcss,
  prisma: siPrisma,
  figma: siFigma,
  git: siGit,
  githubactions: siGithubactions,
};

// Some brand colors (e.g. Next.js/Vercel black) are unreadable against this
// site's dark background — fall back to the theme foreground color for any
// icon too dark to read, using WCAG relative luminance.
function relativeLuminance(hex: string): number {
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const DARK_BG_LUMINANCE_FLOOR = 0.05;

interface TechIconProps extends React.SVGProps<SVGSVGElement> {
  icon: TechIconKey;
}

export default function TechIcon({ icon, className, ...props }: TechIconProps) {
  const data = icons[icon];
  const brandColor =
    relativeLuminance(data.hex) < DARK_BG_LUMINANCE_FLOOR
      ? "var(--color-foreground)"
      : `#${data.hex}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={brandColor}
      className={`w-6 h-6 ${className || ""}`}
      role="img"
      aria-label={data.title}
      {...props}
    >
      <path d={data.path} />
    </svg>
  );
}
