interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export default function Section({ children, ...props }: SectionProps) {
  return (
    <section {...props} className={`relative overflow-hidden ${props.className || ""}`}>
      {children}
    </section>
  )
}