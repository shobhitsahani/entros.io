import {
  AsciiWalletFlowScene,
  AsciiWalletlessFlowScene,
} from "@/components/ui/ascii-scenes";
import type { ComponentType } from "react";

interface SceneProps {
  label?: string;
  aspect?: string;
  className?: string;
  fill?: boolean;
}

const MODES: Array<{
  title: string;
  signal: string;
  placeholder: string;
  Scene: ComponentType<SceneProps>;
  description: string;
}> = [
  {
    title: "Wallet-Connected",
    signal: "High",
    placeholder: "WALLET FLOW",
    Scene: AsciiWalletFlowScene,
    description:
      "Connect a Solana wallet. Your Entros Anchor (non-transferable token) is tied to that wallet. Behavioral fingerprint stored on your device, commitment stored on-chain. Trust Score accumulates over time and is visible to every integrator on-chain. This is the persistent, portable identity. Each wallet requires funded SOL, and re-verification costs compound, making bot farms economically unsustainable at scale.",
  },
  {
    title: "Walletless",
    signal: "Graduated",
    placeholder: "WALLETLESS FLOW",
    Scene: AsciiWalletlessFlowScene,
    description:
      "No wallet, no crypto knowledge needed. First verification acts as a liveness check: the protocol confirms a human produced the behavioral data, but has no prior fingerprint to compare against. Returning verifications build device-bound consistency as behavioral drift is checked against the locally stored (encrypted) fingerprint. The identity is application-scoped and ephemeral. No on-chain Anchor, no portable Trust Score. Clear the browser, switch devices, and the history is gone.",
  },
];

/**
 * Verification Modes—two-mode comparison. Each mode gets its own
 * tall vertical card: an ASCII scene up top, then signal badge,
 * title, and description. Two cards side-by-side on lg+, stacked on
 * mobile. Distinct from the hairline-grid pattern used elsewhere.
 */
export function VerificationModesSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
          // VERIFICATION MODES
        </span>

        <h2 className="mt-6 max-w-2xl font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
          Two modes, graduated trust<span className="text-cyan">.</span>
        </h2>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 md:text-lg">
          Traditional captcha answers &ldquo;is this session human?&rdquo;
          Entros answers a harder question: &ldquo;is this the same human,
          and how long have they been proving it?&rdquo; The protocol
          provides the signal. The integrator sets the threshold.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10">
          {MODES.map((m) => (
            <div key={m.title} className="flex flex-col gap-8">
              <m.Scene label={m.placeholder} aspect="16/10" />

              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                    {m.title}
                  </h3>
                  <span className="rounded-full border border-cyan/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-cyan/80">
                    {m.signal} trust
                  </span>
                </div>
                <p className="mt-5 text-base leading-relaxed text-foreground/65">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
