"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which of the given section ids currently dominates the vertical
 * center of the viewport, so nav highlighting reflects scroll position
 * rather than just the last-clicked link.
 */
export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        // A thin band around the vertical center of the viewport — a
        // section becomes "active" once it dominates that band, which
        // holds up better across sections of very different heights than
        // "topmost visible element" heuristics.
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
