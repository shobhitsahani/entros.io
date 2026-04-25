import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";

const MODES = [
  {
    title: "Wallet-Connected",
    signal: "High",
    description:
      "Connect a Solana wallet. Your Entros Anchor (non-transferable token) is tied to that wallet. Behavioral fingerprint stored on your device, commitment stored on-chain. Trust Score accumulates over time and is visible to every integrator on-chain. This is the persistent, portable identity. Each wallet requires funded SOL, and re-verification costs compound, making bot farms economically unsustainable at scale.",
  },
  {
    title: "Walletless",
    signal: "Graduated",
    description:
      "No wallet, no crypto knowledge needed. First verification acts as a liveness check: the protocol confirms a human produced the behavioral data, but has no prior fingerprint to compare against. Returning verifications build device-bound consistency as behavioral drift is checked against the locally stored (encrypted) fingerprint. The identity is application-scoped and ephemeral. No on-chain Anchor, no portable Trust Score. Clear the browser, switch devices, and the history is gone.",
  },
];

export function VerificationModesSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// VERIFICATION MODES"}
      </TextShimmer>

      <h3 className="mt-4 font-mono text-xl font-bold text-foreground md:text-2xl">
        Two modes, graduated trust.
      </h3>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Traditional captcha answers &ldquo;is this session human?&rdquo; Entros
        answers a harder question: &ldquo;is this the same human, and how long
        have they been proving it?&rdquo; The protocol provides the signal.
        The integrator sets the threshold for their use case.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {MODES.map((m) => (
          <GlowCard key={m.title}>
            <div className="flex items-center gap-3">
              <p className="font-mono text-base font-semibold text-foreground">
                {m.title}
              </p>
              <span className="rounded-full border border-cyan/20 px-2 py-0.5 text-[10px] font-mono text-cyan/70">
                {m.signal} trust
              </span>
            </div>
            <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
              {m.description}
            </p>
          </GlowCard>
        ))}
      </div>
    </section>
  );
}
