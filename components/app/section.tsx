"use client";

import { useInView } from "@/hooks/useInView";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export default function Section({ children, ...props }: SectionProps) {
  const { ref, isInView } = useInView<HTMLElement>();

  return (
    <section
      {...props}
      ref={ref}
      className={`relative overflow-hidden py-[var(--portfolio-section-spacing,5rem)] md:py-[var(--portfolio-section-spacing-desktop,8rem)] ${isInView ? "in-view" : ""} ${props.className || ""}`}
    >
      {children}
    </section>
  )
}
