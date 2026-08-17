import SectionTitle from "@/components/app/section-title";
import type { SectionHeader } from "@/lib/content/types";

export default function SectionHeading({
  header,
  align = "left",
}: {
  header: SectionHeader;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`max-w-3xl mb-16 ${align === "center" ? "text-center mx-auto" : ""}`}
    >
      <SectionTitle title={header.eyebrow} />
      <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
        {header.heading}{" "}
        <span className="font-serif italic font-normal text-[var(--color-heading-accent)]">
          {header.headingAccent}
        </span>
      </h2>
      <p className="text-muted-foreground animate-fade-in animation-delay-200">
        {header.description}
      </p>
    </div>
  );
}
