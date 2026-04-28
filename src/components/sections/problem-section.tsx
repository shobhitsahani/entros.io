/**
 * Problem section—single statement of stakes + frame, set in the
 * display register to carry the same typographic weight as the hero.
 */
export function ProblemSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
          // THE PROBLEM
        </span>

        <h2 className="mt-6 font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
          Bots stole roughly{" "}
          <span className="text-foreground">$500M</span> from Solana
          protocols last year<span className="text-cyan">.</span>
        </h2>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 md:text-lg">
          The fix the network needs is a proof-of-personhood primitive
          that runs in any browser, keeps raw biometric data on the
          device, and travels across every dApp on Solana. That&apos;s
          the slot Entros fills.
        </p>
      </div>
    </section>
  );
}
