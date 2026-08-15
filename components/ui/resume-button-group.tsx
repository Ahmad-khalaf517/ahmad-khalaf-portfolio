import { Eye, Download } from "lucide-react";

interface ResumeButtonGroupProps {
  resumeUrl: string;
  className?: string;
}

export function ResumeButtonGroup({ resumeUrl, className = "" }: ResumeButtonGroupProps) {
  return (
    <div
      className={`inline-flex items-stretch rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 overflow-hidden ${className}`}
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
        className="flex items-center px-3 py-2 border-l border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors"
      >
        <Eye className="w-4 h-4" />
      </a>
      <a
        href={resumeUrl}
        download
        title="Download resume"
        aria-label="Download resume"
        className="flex items-center px-3 py-2 border-l border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}
