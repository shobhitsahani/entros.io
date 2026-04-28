/**
 * Threat Model—single-column long-form statement. Distinct from the
 * grid and table sections elsewhere on the page; reads like a policy
 * document, fitting the page's transparency posture.
 */
export function ThreatModel() {
  return (
    <section id="threat-model" className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
          // THREAT MODEL
        </span>

        <h2 className="mt-6 max-w-3xl font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
          Who we build against<span className="text-cyan">.</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
              // ASSUMED CAPABILITIES
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/70 md:text-lg">
              A well-resourced adversary with access to modern voice
              cloning (XTTS-v2, F5-TTS, ElevenLabs), generative models
              for biometric time-series, full source-code access to our
              public components (SDK, circuits, on-chain programs),
              unlimited wallets and devnet SOL, and days to weeks of
              time per attack campaign.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
              // OUT OF SCOPE
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/55 md:text-lg">
              We do not assume the adversary can compromise user
              devices, mount physical hardware attacks on phones, or
              access our private defense-layer infrastructure. Those
              are separate threat categories covered by standard
              client-side hardening, hardware root-of-trust guidance,
              and infrastructure security practice respectively.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
