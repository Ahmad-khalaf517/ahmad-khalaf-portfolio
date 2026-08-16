import { Eye, Download } from "lucide-react";

interface ResumeButtonGroupProps {
  resumeUrl: string;
  className?: string;
}

const resumeActionClass = `relative flex min-w-11 items-center justify-center px-3 py-2
  border-l border-primary-foreground/20 transition-colors
  hover:bg-primary-foreground/15 active:bg-primary-foreground/25
  focus-visible:z-10 focus-visible:outline-none focus-visible:bg-primary-foreground/15
  focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-foreground/80`;

export function ResumeButtonGroup({ resumeUrl, className = "" }: ResumeButtonGroupProps) {
  return (
    <div
      role="group"
      aria-label="Resume actions"
      className={`inline-flex min-h-11 items-stretch rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-shadow overflow-hidden ${className}`}
    >
      <span className="flex flex-1 items-center justify-center pl-4 pr-3 py-2 text-sm font-medium select-none">
        Resume
      </span>
      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="View resume"
        aria-label="View resume"
        className={resumeActionClass}
      >
        <Eye className="size-[18px]" aria-hidden="true" />
      </a>
      <a
        href={resumeUrl}
        download
        title="Download resume"
        aria-label="Download resume"
        className={resumeActionClass}
      >
        <Download className="size-[18px]" aria-hidden="true" />
      </a>
    </div>
  );
}
