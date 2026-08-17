interface SectionContentProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export default function SectionContent({ children, ...props }: SectionContentProps) {
  return (
    <div
      {...props}
      className={`container mx-auto px-[var(--portfolio-content-padding,1.5rem)] z-10 relative ${props.className || ""}`}
    >
      {children}
    </div>
  ) 
}
