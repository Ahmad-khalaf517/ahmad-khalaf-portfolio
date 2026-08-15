"use client";

import { useRef } from "react";

type TiltCardProps = React.HTMLAttributes<HTMLDivElement>;

const MAX_TILT_DEG = 6;

export function TiltCard({ children, className, style, ...props }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    el.style.transition = "transform 0.1s ease-out";
    el.style.transform = `perspective(1000px) rotateX(${-y * MAX_TILT_DEG}deg) rotateY(${x * MAX_TILT_DEG}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.4s ease-out";
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
