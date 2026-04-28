import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { integrationSnippets, useCaseSnippets } from "@/data/integration-snippets";
import { CodeBlock } from "@/components/ui/code-block";
import { IntegratePlayground } from "./integrate-playground";

const CONFIG_OPTIONS = [
  { name: "cluster", type: '"devnet" | "mainnet-beta"', description: "Solana cluster to connect to." },
  { name: "rpcEndpoint", type: "string", description: "Custom RPC URL (optional)." },
  { name: "relayerUrl", type: "string", description: "Entros relayer endpoint (walletless mode only)." },
  { name: "relayerApiKey", type: "string", description: "API key for walletless mode (optional)." },
  { name: "wasmUrl", type: "string", description: "Path to entros_hamming.wasm circuit artifact." },
  { name: "zkeyUrl", type: "string", description: "Path to entros_hamming_final.zkey proving key." },
  { name: "threshold", type: "number", description: "Hamming distance threshold (default: 96)." },
];

const ABUSE_MECHANISMS = [
  {
    number: "01",
    title: "Rate limiting",
    description:
      "Cap verifications per IP, per session, or per time window. The relayer enforces limits before a transaction reaches the chain.",
  },
  {
    number: "02",
    title: "Trust Score thresholds",
    description:
      "Require a minimum Trust Score to access protected features. New identities start at zero. High-value actions can require weeks of consistent verification history.",
  },
  {
    number: "03",
    title: "Protocol fee defense",
    description:
      "Every verification costs the user SOL. Bot farms must fund wallets and pay per attempt. The cost scales with the attack.",
  },
  {
    number: "04",
    title: "Graduated trust tiers",
    description:
      "Walletless mode is a liveness check. Wallet-connected mode builds portable, on-chain Trust Score. Match the tier to the sensitivity of the action.",
  },
];

export function IntegrateGuide() {
  return (
    <>
      {/* Quick Start—two mode panels in hairline grid */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
            // QUICK START
          </span>

          <h2 className="mt-6 max-w-3xl font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
            Two modes<span className="text-cyan">.</span> One SDK<span className="text-cyan">.</span>
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Wallet-connected is the primary flow—a Groth16 ZK proof, an
            on-chain Entros Anchor, a SAS attestation, and a Trust Score
            that compounds across re-verifications. Walletless is a
            captcha-equivalent tier for sign-up flows—device-bound,
            ephemeral, no on-chain identity written.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-px border-y border-border bg-border lg:grid-cols-2">
            {integrationSnippets.map((snippet, idx) => (
              <div key={snippet.mode} className="flex flex-col bg-background p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tracking-[0.2em] text-cyan">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/50">
                    {snippet.mode === "wallet-connected" ? "PRIMARY" : "CAPTCHA TIER"}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                  {snippet.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-foreground/65">
                  {snippet.description}
                </p>

                <div className="mt-6">
                  <CodeBlock code={snippet.code} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Try it live—playground */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
            // TRY IT LIVE
          </span>

          <h2 className="mt-6 max-w-3xl font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
            Query on-chain identity<span className="text-cyan">.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 md:text-lg">
            This is what your integration reads. Paste any wallet address
            to see its Entros verification status, Trust Score, and history
            directly from Solana devnet.
          </p>

          <div className="mt-12">
            <IntegratePlayground />
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
            // USE CASES
          </span>

          <h2 className="mt-6 max-w-3xl font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
            Read<span className="text-cyan">.</span> Gate<span className="text-cyan">.</span> Display<span className="text-cyan">.</span>
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-px border-y border-border bg-border lg:grid-cols-2">
            {useCaseSnippets.map((snippet, idx) => (
              <div
                key={snippet.title}
                className={`flex flex-col bg-background p-8 md:p-10 ${
                  idx === 2 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tracking-[0.2em] text-cyan">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                  {snippet.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-foreground/65">
                  {snippet.description}
                </p>

                <div className="mt-6">
                  <CodeBlock code={snippet.code} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Drop-in components */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
            // DROP-IN COMPONENTS
          </span>

          <h2 className="mt-6 max-w-3xl font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
            Self-contained React components<span className="text-cyan">.</span>
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Copy the source, paste into your Tailwind project, render
            anywhere. No custom UI dependencies, no Entros backend. Each
            component reads directly from Solana via your existing wallet
            connection.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-px border-y border-border bg-border md:grid-cols-2">
            <div className="flex flex-col bg-background p-8 md:p-10">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-cyan" strokeWidth={1.5} />
                <span className="h-px flex-1 bg-border" />
              </div>

              <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                &lt;EntrosBadge /&gt;
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-foreground/65">
                Pill that displays any wallet's Trust Score. Use in
                profiles, comments, leaderboards, anywhere humanness
                matters.
              </p>

              <Link
                href="/badge-demo"
                className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-cyan transition-colors hover:text-foreground"
              >
                Live demo · source
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="flex flex-col bg-background p-8 md:p-10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-cyan" strokeWidth={1.5} />
                <span className="h-px flex-1 bg-border" />
              </div>

              <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                &lt;EntrosGate minTrustScore=&#123;N&#125;&gt;
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-foreground/65">
                Route guard. Wrap any content, set a threshold, the gate
                handles wallet connection, identity lookup, and
                verification prompts.
              </p>

              <Link
                href="/gate-demo"
                className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-cyan transition-colors hover:text-foreground"
              >
                Live demo · source
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration—hairline table */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
            // CONFIGURATION
          </span>

          <h2 className="mt-6 max-w-3xl font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
            Seven options<span className="text-cyan">.</span> Sensible defaults<span className="text-cyan">.</span>
          </h2>

          <div className="mt-12 overflow-x-auto border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                    Option
                  </th>
                  <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                    Type
                  </th>
                  <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONFIG_OPTIONS.map((opt, i) => (
                  <tr
                    key={opt.name}
                    className={i < CONFIG_OPTIONS.length - 1 ? "border-b border-border" : ""}
                  >
                    <td className="px-5 py-4 font-mono text-cyan">{opt.name}</td>
                    <td className="px-5 py-4 font-mono text-foreground/55">{opt.type}</td>
                    <td className="px-5 py-4 leading-relaxed text-foreground/75">
                      {opt.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing—single panel */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
                // PRICING
              </span>

              <h2 className="mt-6 font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
                Zero integration cost<span className="text-cyan">.</span>
              </h2>
            </div>

            <div className="lg:col-span-7">
              <p className="text-base leading-relaxed text-foreground/70 md:text-lg">
                Wallet-connected users pay a small protocol fee per
                verification (~0.005 SOL). Your application reads on-chain
                state for free via{" "}
                <code className="font-mono text-cyan">verifyEntrosAttestation()</code>.
                No escrow, no API keys, no billing relationship.
              </p>
              <p className="mt-6 text-base leading-relaxed text-foreground/65 md:text-lg">
                You get verified humans. The user pays to prove they're
                human. The protocol gets a recurring fee that funds
                validator rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Abuse Prevention—4 mechanism cards in 2-col hairline grid */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
            // ABUSE PREVENTION
          </span>

          <h2 className="mt-6 max-w-3xl font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
            Built-in bot resistance<span className="text-cyan">.</span>
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Every verification costs the user SOL. Synthetic data is
            rejected server-side before reaching the chain. Bot farms must
            fund thousands of wallets, pay per verification, and maintain
            Trust Score across months. You control trust requirements
            through four mechanisms.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-px border-y border-border bg-border md:grid-cols-2">
            {ABUSE_MECHANISMS.map((m) => (
              <div key={m.number} className="flex flex-col bg-background p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tracking-[0.2em] text-cyan">
                    {m.number}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                  {m.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-foreground/65">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
