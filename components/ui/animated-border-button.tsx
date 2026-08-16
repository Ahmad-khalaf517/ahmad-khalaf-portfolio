const animatedBorderClasses = `cursor-pointer relative inline-flex min-h-14 items-center justify-center
  bg-transparent border border-border text-foreground hover:border-primary/50
  transition-all duration-1000 focus:outline-none focus-visible:ring-2
  focus-visible:ring-primary focus-visible:ring-offset-2 group px-7 text-base
  font-medium rounded-full overflow-visible animated-border`;

function AnimatedBorderGraphic() {
  return (
    <svg
      aria-hidden="true"
      className="absolute left-0 top-0 w-full h-full pointer-events-none download-cv-border"
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
    >
      <path
        d="M 30,1 A 29,29 0 0 0 1,30 L 1,30 A 29,29 0 0 0 30,59 L 170,59 A 29,29 0 0 0 199,30 L 199,30 A 29,29 0 0 0 170,1 Z"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeDasharray="400 550"
        strokeDashoffset="400"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animated-border-path"
      />
    </svg>
  );
}

type AnimatedBorderButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const AnimatedBorderButton = ({
  children,
  className = "",
  ...props
}: AnimatedBorderButtonProps) => {
  return (
    <button
      className={`${animatedBorderClasses} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      <AnimatedBorderGraphic />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

type AnimatedBorderLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const AnimatedBorderLink = ({
  children,
  className = "",
  ...props
}: AnimatedBorderLinkProps) => {
  return (
    <a className={`${animatedBorderClasses} ${className}`} {...props}>
      <AnimatedBorderGraphic />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </a>
  );
};
