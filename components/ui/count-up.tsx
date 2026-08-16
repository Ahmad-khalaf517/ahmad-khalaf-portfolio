import type { CSSProperties } from "react";

type CountUpStyle = CSSProperties & {
  "--count-target": number;
  "--count-duration": `${number}ms`;
};

export function CountUp({ value, duration = 700 }: { value: string; duration?: number }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";

  if (target === null) {
    return <span>{value}</span>;
  }

  const style: CountUpStyle = {
    "--count-target": target,
    "--count-duration": `${duration}ms`,
  };

  return (
    <span
      className="count-up"
      data-suffix={suffix}
      style={style}
      aria-label={value}
    >
      <span className="sr-only">{value}</span>
    </span>
  );
}
