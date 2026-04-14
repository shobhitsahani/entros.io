export function SubpageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-32 pb-20 text-center">
      <h1 className="text-glow-cyan font-mono text-4xl font-bold tracking-[0.02em] md:text-5xl lg:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-6 text-lg text-muted leading-relaxed md:text-xl whitespace-pre-line">
          {subtitle}
        </p>
      )}
    </section>
  );
}
