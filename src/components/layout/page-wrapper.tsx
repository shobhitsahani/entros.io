export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
      {children}
    </div>
  );
}
