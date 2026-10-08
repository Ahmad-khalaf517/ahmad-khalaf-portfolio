"use client";

import { useInView } from "@/hooks/useInView";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  paddingClassName?: string;
}

export default function Section({ children, paddingClassName = "py-20 md:py-32", className = "", ...props }: SectionProps) {
  const { ref, isInView } = useInView<HTMLElement>();

  return (
    <section
      {...props}
      ref={ref}
      className={`relative overflow-hidden ${paddingClassName} ${isInView ? "in-view" : ""} ${className}`}
    >
      {children}
    </section>
  )
}
