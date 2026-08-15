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
      className={`relative overflow-hidden py-20 md:py-32 ${isInView ? "in-view" : ""} ${props.className || ""}`}
    >
      {children}
    </section>
  )
}
