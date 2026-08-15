"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 0-1 progress representing how far a fixed "reading line" (viewport
 * center) has swept down through the observed element — used to drive
 * scroll-linked fill effects like the experience timeline.
 */
export function useScrollFill<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    const updateProgress = () => {
      const rect = el.getBoundingClientRect();
      const readingLine = window.innerHeight * 0.5;
      const p = (readingLine - rect.top) / rect.height;
      setProgress(Math.min(1, Math.max(0, p)));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}
