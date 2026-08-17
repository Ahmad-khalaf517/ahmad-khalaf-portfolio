import type { Metadata } from "next";
import type { PublishedPortfolioSnapshot } from "@/lib/portfolio/schemas";

export function createPortfolioMetadata(
  snapshot: PublishedPortfolioSnapshot,
  canonicalPath: string,
): Metadata {
  const { title, description, image } = snapshot.seo;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      title,
      description,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
