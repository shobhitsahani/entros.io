import { TextShimmer } from "@/components/ui/text-shimmer";

const tiers = [
  {
    name: "Tier 0",
    label: "Cryptographic gate",
    description:
      "Zero-knowledge proofs of behavioral consistency. Groth16 proving system. Public verifier on Solana. Every verification produces a proof that the user\u2019s behavioral fingerprint is within a hidden Hamming distance threshold of their baseline, without revealing either fingerprint. Open source, auditable, verifiable on-chain.",
  },
  {
    name: "Tier 1",
    label: "Statistical distribution checks",
    description:
      "Server-side validation of the 134-dimensional feature vector extracted from each verification. Multiple independent checks verify that the statistical properties of extracted features are consistent with human physiology, not synthetic generation. Specific checks and threshold values are not published.",
  },
  {
    name: "Tier 2",
    label: "Behavioral coupling signals",
    description:
      "Time-series analysis of phonation and kinematic signals sampled during capture. Real human speech and hand motion share motor-cortex origins and produce measurable temporal coupling at short lags; independent synthesis does not. Enforcement is live on production since April 2026, calibrated against a two-wave red team study that isolated the layer's specific contribution to voice-replay rejection.",
  },
];

export function DefenseLayers() {
  return (
    <section id="defense-layers" className="mx-auto max-w-4xl px-6 py-16">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
      >
        {"// DEFENSE LAYERS"}
      </TextShimmer>
      <h2 className="mt-4 font-mono text-2xl font-semibold text-foreground md:text-3xl">
        How we defend
      </h2>
      <div className="mt-8 space-y-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="rounded-xl border border-border p-6"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-lg font-semibold text-cyan">
                {tier.name}
              </span>
              <span className="font-mono text-sm text-muted">
                {tier.label}
              </span>
            </div>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {tier.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
