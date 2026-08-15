"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TechIcon from "@/assets/icons/tech-icon";
import type { TechnologyItem } from "@/lib/content/types";

const REPEAT = 3;
const AUTO_SCROLL_SPEED = 40; // px/sec
const RESUME_DELAY = 1000; // ms of idle time before auto-scroll resumes / controls hide
const BUTTON_SCROLL_FRACTION = 0.6; // portion of visible width to jump per click

export function TechMarquee({ technologies }: { technologies: TechnologyItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef(() => {});
  const scheduleResumeRef = useRef(() => {});
  const [controlsVisible, setControlsVisible] = useState(false);
  const items = Array.from({ length: REPEAT }).flatMap(() => technologies);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = scrollerRef.current;
    if (!container || !el) return;

    const copyWidth = el.scrollWidth / REPEAT;
    el.scrollLeft = copyWidth; // start in the middle copy so either drag direction has room

    let raf = 0;
    let lastTime: number | null = null;
    let paused = false;
    let dragging = false;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

    const tick = (time: number) => {
      if (lastTime === null) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!paused) {
        el.scrollLeft += AUTO_SCROLL_SPEED * delta;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Seamless loop: jump by one copy-width once scroll drifts too far
    // toward either end, well before running out of duplicated content.
    const handleScroll = () => {
      if (el.scrollLeft < copyWidth * 0.5) {
        el.scrollLeft += copyWidth;
      } else if (el.scrollLeft > copyWidth * (REPEAT - 1.5)) {
        el.scrollLeft -= copyWidth;
      }
    };

    const pause = () => {
      paused = true;
      setControlsVisible(true);
      if (resumeTimeout) clearTimeout(resumeTimeout);
    };
    pauseRef.current = pause;

    const scheduleResume = () => {
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        paused = false;
        setControlsVisible(false);
      }, RESUME_DELAY);
    };
    scheduleResumeRef.current = scheduleResume;

    // Browsers don't support click-drag scrolling out of the box (only
    // touch/trackpad do natively) — hand-roll it for mouse pointers only,
    // and let touch fall through to native scrolling untouched.
    const handlePointerDown = (e: PointerEvent) => {
      pause();
      if (e.pointerType !== "mouse") return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartScrollLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragging || e.pointerType !== "mouse") return;
      el.scrollLeft = dragStartScrollLeft - (e.clientX - dragStartX);
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

    el.addEventListener("scroll", handleScroll, { passive: true });
    el.addEventListener("pointerdown", handlePointerDown);
    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerup", handlePointerUp);
    el.addEventListener("pointercancel", handlePointerUp);
    el.addEventListener("wheel", handleWheel, { passive: true });
    // Hover tracking lives on the whole container (not just the scroller) so
    // moving the mouse onto the prev/next buttons — which sit outside the
    // scroller's own bounds — doesn't count as "leaving" and hide them.
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", scheduleResume);
    // Belt-and-suspenders: pointerup isn't reliably synthesized from touch
    // on every browser, so a touch tap/drag could otherwise leave the
    // marquee paused forever. Native touch events always fire.
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", scheduleResume);
    el.addEventListener("touchcancel", scheduleResume);

    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimeout) clearTimeout(resumeTimeout);
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerup", handlePointerUp);
      el.removeEventListener("pointercancel", handlePointerUp);
      el.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", scheduleResume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", scheduleResume);
      el.removeEventListener("touchcancel", scheduleResume);
    };
  }, [technologies]);

  const scrollByDirection = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    pauseRef.current();
    el.scrollBy({ left: direction * el.clientWidth * BUTTON_SCROLL_FRACTION, behavior: "smooth" });
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
        className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-pointer ${controlsClass}`}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        type="button"
        aria-label="Next technologies"
        onClick={() => scrollByDirection(1)}
        className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-pointer ${controlsClass}`}
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar cursor-grab select-none"
      >
        {items.map((tech, idx) => (
          <div
            key={idx}
            className="shrink-0 flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full glass"
          >
            <TechIcon icon={tech.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-sm sm:text-lg font-medium text-muted-foreground whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
