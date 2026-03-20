export function SectionLabel({ children }: { children: string }) {
  return (
    <span className="font-mono text-sm tracking-widest uppercase text-muted">
      {children}
    </span>
  );
}
