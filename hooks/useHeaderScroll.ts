"use client";

import { useEffect, useState } from "react";

interface HeaderScrollState {
  isScrolled: boolean;
  progress: number;
}

export function useHeaderScroll(threshold = 0): HeaderScrollState {
  const [scrollState, setScrollState] = useState<HeaderScrollState>({
    isScrolled: false,
    progress: 0,
  });

  useEffect(() => {
    let animationFrame = 0;

    const update = () => {
      const scrollTop = window.scrollY;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setScrollState({
        isScrolled: scrollTop > threshold,
        progress:
          scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0,
      });
      animationFrame = 0;
    };

    const scheduleUpdate = () => {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [threshold]);

  return scrollState;
}
