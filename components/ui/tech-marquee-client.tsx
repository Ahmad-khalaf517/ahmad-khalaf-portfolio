"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const REPEAT = 3;
const AUTO_SCROLL_SPEED = 40;
const RESUME_DELAY = 1000;
const BUTTON_SCROLL_FRACTION = 0.6;

export function TechMarqueeClient({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef(() => {});
  const scheduleResumeRef = useRef(() => {});
  const [controlsVisible, setControlsVisible] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = scrollerRef.current;
    if (!container || !el) return;

    const copyWidth = el.scrollWidth / REPEAT;
    el.scrollLeft = copyWidth;

    let raf = 0;
    let lastTime: number | null = null;
    let paused = false;
    let isInView = false;
    let dragging = false;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = reducedMotionQuery.matches;

    const shouldAnimate = () =>
      isInView && !paused && !prefersReducedMotion && !document.hidden;

    const tick = (time: number) => {
      if (!shouldAnimate()) {
        raf = 0;
        lastTime = null;
        return;
      }

      if (lastTime === null) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      el.scrollLeft += AUTO_SCROLL_SPEED * delta;
      raf = requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (raf || !shouldAnimate()) return;
      lastTime = null;
      raf = requestAnimationFrame(tick);
    };

    const stopAnimation = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastTime = null;
    };

    const syncAnimation = () => {
      if (shouldAnimate()) startAnimation();
      else stopAnimation();
    };

    const handleScroll = () => {
      if (el.scrollLeft < copyWidth * 0.5) {
        el.scrollLeft += copyWidth;
      } else if (el.scrollLeft > copyWidth * (REPEAT - 1.5)) {
        el.scrollLeft -= copyWidth;
      }
    };

    const pause = () => {
      paused = true;
      stopAnimation();
      setControlsVisible(true);
      if (resumeTimeout) clearTimeout(resumeTimeout);
    };
    pauseRef.current = pause;

    const scheduleResume = () => {
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        paused = false;
        setControlsVisible(false);
        startAnimation();
      }, RESUME_DELAY);
    };
    scheduleResumeRef.current = scheduleResume;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry?.isIntersecting ?? false;
        syncAnimation();
      },
      { rootMargin: "200px" },
    );
    visibilityObserver.observe(container);

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      syncAnimation();
    };
    const handleVisibilityChange = () => syncAnimation();

    const handlePointerDown = (event: PointerEvent) => {
      pause();
      if (event.pointerType !== "mouse") return;
      dragging = true;
      dragStartX = event.clientX;
      dragStartScrollLeft = el.scrollLeft;
      el.setPointerCapture(event.pointerId);
      el.style.cursor = "grabbing";
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerType !== "mouse") return;
      el.scrollLeft = dragStartScrollLeft - (event.clientX - dragStartX);
    };

    const handlePointerUp = () => {
      dragging = false;
      el.style.cursor = "";
      scheduleResume();
    };

    const handleWheel = () => {
      pause();
      scheduleResume();
    };

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    el.addEventListener("scroll", handleScroll, { passive: true });
    el.addEventListener("pointerdown", handlePointerDown);
    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerup", handlePointerUp);
    el.addEventListener("pointercancel", handlePointerUp);
    el.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", scheduleResume);
    container.addEventListener("focusin", pause);
    container.addEventListener("focusout", scheduleResume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", scheduleResume);
    el.addEventListener("touchcancel", scheduleResume);

    return () => {
      stopAnimation();
      if (resumeTimeout) clearTimeout(resumeTimeout);
      visibilityObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerup", handlePointerUp);
      el.removeEventListener("pointercancel", handlePointerUp);
      el.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", scheduleResume);
      container.removeEventListener("focusin", pause);
      container.removeEventListener("focusout", scheduleResume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", scheduleResume);
      el.removeEventListener("touchcancel", scheduleResume);
    };
  }, []);

  const scrollByDirection = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    pauseRef.current();
    el.scrollBy({
      left: direction * el.clientWidth * BUTTON_SCROLL_FRACTION,
      behavior: "smooth",
    });
    scheduleResumeRef.current();
  };

  const controlsClass = controlsVisible
    ? "opacity-100"
    : "opacity-0 pointer-events-none";

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-l from-background to-transparent z-10" />

      <button
        type="button"
        aria-label="Previous technologies"
        onClick={() => scrollByDirection(-1)}
        className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 min-h-11 min-w-11 inline-flex items-center justify-center rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-pointer ${controlsClass}`}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        type="button"
        aria-label="Next technologies"
        onClick={() => scrollByDirection(1)}
        className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 min-h-11 min-w-11 inline-flex items-center justify-center rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-pointer ${controlsClass}`}
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar cursor-grab select-none"
      >
        {children}
      </div>
    </div>
  );
}
