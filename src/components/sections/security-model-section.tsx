import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";

const DEFENSES = [
  {
    title: "Minimum Distance Constraint",
    description:
      "The ZK circuit enforces a minimum Hamming distance between consecutive fingerprints. Perfect replay is rejected at the proof level. A bot submitting identical synthetic data twice gets blocked before reaching the chain.",
  },
  {
    title: "Server-Side Feature Validation",
    description:
      "The 134-dimensional statistical feature summary is validated by proprietary server-side models before the on-chain proof is accepted. These models detect synthetic speech artifacts, unnatural jitter patterns, and cross-modality inconsistencies. The validation logic is private—the attacker can see that checks happen but not how they work.",
  },
  {
    title: "Progressive Trust Score",
    description:
      "Trust Score rewards consistency over time, not volume. 100 verifications in one day scores lower than weekly verifications over 3 months. Recency weighting and regularity bonuses make bot farming slow and expensive.",
  },
  {
    title: "Per-Session Randomness",
    description:
      "Each verification generates a unique random phrase and Lissajous curve. No two sessions share the same challenge. The challenge elicits involuntary behavioral patterns (voice prosody, hand tremor, touch pressure) that are harder to synthesize than the words themselves.",
  },
  {
    title: "Multi-Modal Capture",
    description:
      "Three independent sensor streams record in parallel: microphone, pointer/touch digitizer, and device motion (where available). A bot needs to fake realistic voice, tremor, and touch pressure simultaneously. Spoofing one modality is feasible. Spoofing all three with consistent behavioral entropy is exponentially harder.",
  },
  {
    title: "Cross-Wallet Fingerprint Registry",
    description:
      "The server maintains a registry of all verified behavioral fingerprints. New verifications are compared against existing entries. Sybil attacks—where one actor creates many identities—produce clustered fingerprints that the registry detects and rejects.",
  },
  {
    title: "Economic Disincentives",
    description:
      "Each verification costs the user SOL. Each wallet requires funding. Server-side validation rejects synthetic data before it reaches the chain. Maintaining thousands of fake identities over months—funding wallets, paying per verification, building Trust Score across separate days—costs real money. The attacker pays for every attempt.",
  },
];


export function SecurityModelSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// SECURITY MODEL"}
      </TextShimmer>

      <h2 className="mt-4 font-mono text-2xl font-bold text-foreground md:text-3xl">
        How IAM resists bots.
      </h2>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Open protocol for trust. Private validation for security. Synthetic
        data is rejected server-side before reaching the chain. Users pay a
        small protocol fee per verification. Bots pay real money at scale.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-6">
        {DEFENSES.map((d, i) => {
          const isLast = i === DEFENSES.length - 1;
          const colSpan = isLast ? "md:col-span-6" : "md:col-span-3";
          return (
            <GlowCard key={d.title} className={colSpan}>
              <p className="font-mono text-sm font-semibold text-foreground">
                {d.title}
              </p>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                {d.description}
              </p>
            </GlowCard>
          );
        })}
      </div>

    </section>
  );
}
