export default function SectionTitle({ title }: { title: string }) {
  return (
    <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
      {title}
    </span>
  );
}
