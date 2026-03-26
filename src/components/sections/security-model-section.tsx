"use client";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";

const DEFENSES = [
  {
    title: "Minimum Distance Constraint",
    description:
      "The ZK circuit enforces a minimum Hamming distance between consecutive fingerprints. Perfect replay is rejected at the proof level. A bot submitting identical synthetic data twice gets blocked before reaching the chain.",
  },
  {
    title: "Behavioral Entropy Scoring",
    description:
      "The feature extraction pipeline measures Shannon entropy and jitter variance across each sensor stream. Real human data has moderate, fluctuating entropy. Synthetic data from TTS engines or scripted inputs is too uniform and gets flagged before hashing.",
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
      "Three independent sensor streams record in parallel: microphone, pointer/touch digitizer, and device motion (where available). A bot needs to fake realistic voice, tremor, and touch pressure simultaneously. Spoofing one modality is feasible. Spoofing all three with consistent behavioral entropy is not.",
  },
  {
    title: "Economic Disincentives",
    description:
      "Each verification costs ~$0.01 on-chain. Each wallet requires SOL. Maintaining thousands of fake identities over months, re-verifying regularly to build trust, costs real money. The attack costs more than the value it extracts.",
  },
];

const MODES = [
  {
    title: "Wallet-Connected",
    description:
      "Connect a Solana wallet. Your IAM Anchor (non-transferable token) is tied to that wallet. Behavioral fingerprint stored on your device, commitment stored on-chain. Trust Score accumulates over time. This is the persistent identity that integrators check.",
  },
  {
    title: "Walletless",
    description:
      "No wallet, no crypto knowledge needed. The Pulse SDK captures your behavioral data, generates a proof, and the IAM relayer submits it on-chain. Stores the behavioral fingerprint locally (encrypted) for re-verification but does not create an on-chain identity Anchor. Works as a drop-in captcha replacement.",
  },
];

export function SecurityModelSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
        duration={3}
      >
        {"// SECURITY MODEL"}
      </TextShimmer>

      <h2 className="mt-4 font-mono text-2xl font-bold text-foreground md:text-3xl">
        How IAM resists bots.
      </h2>
      <p className="mt-3 max-w-2xl text-foreground/70">
        No single verification proves humanness. IAM makes Sybil attacks
        economically irrational through layered defenses that increase the cost
        of faking identity at scale.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {DEFENSES.map((d) => (
          <GlowCard key={d.title}>
            <p className="font-mono text-sm font-semibold text-foreground">
              {d.title}
            </p>
            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
              {d.description}
            </p>
          </GlowCard>
        ))}
      </div>

      <div className="mt-16">
        <TextShimmer
          as="span"
          className="font-mono text-sm tracking-widest uppercase"
          duration={3}
        >
          {"// VERIFICATION MODES"}
        </TextShimmer>

        <h3 className="mt-4 font-mono text-xl font-bold text-foreground">
          Two modes, different guarantees.
        </h3>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {MODES.map((m) => (
            <GlowCard key={m.title}>
              <p className="font-mono text-base font-semibold text-foreground">
                {m.title}
              </p>
              <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                {m.description}
              </p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
