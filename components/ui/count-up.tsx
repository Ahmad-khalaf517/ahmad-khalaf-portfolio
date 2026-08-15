"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

export function CountUp({ value, duration = 1500 }: { value: string; duration?: number }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";
  const { ref, isInView } = useInView<HTMLSpanElement>({ threshold: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || target === null) return;

    let start: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);

  if (target === null) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}
