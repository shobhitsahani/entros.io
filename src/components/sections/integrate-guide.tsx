"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { integrationSnippets, useCaseSnippets } from "@/data/integration-snippets";
import { CodeBlock } from "@/components/ui/code-block";
import { GlowCard } from "@/components/ui/glow-card";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { IntegratePlayground } from "./integrate-playground";

const CONFIG_OPTIONS = [
  { name: "cluster", type: '"devnet" | "mainnet-beta"', description: "Solana cluster to connect to" },
  { name: "rpcEndpoint", type: "string", description: "Custom RPC URL (optional)" },
  { name: "relayerUrl", type: "string", description: "Entros relayer endpoint (walletless mode only)" },
  { name: "relayerApiKey", type: "string", description: "API key for walletless mode (optional)" },
  { name: "wasmUrl", type: "string", description: "Path to entros_hamming.wasm circuit artifact" },
  { name: "zkeyUrl", type: "string", description: "Path to entros_hamming_final.zkey proving key" },
  { name: "threshold", type: "number", description: "Hamming distance threshold (default: 96)" },
];

export function IntegrateGuide() {
  return (
    <div className="space-y-16">
      <section>
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// QUICK START"}
        </TextShimmer>

        <div className="mt-6">
          <GlowCard>
            <p className="text-xs font-mono uppercase tracking-widest text-muted mb-3">
              Install
            </p>
            <CodeBlock
              code="npm install @entros/pulse-sdk"
                          />
          </GlowCard>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {integrationSnippets.map((snippet) => (
            <GlowCard key={snippet.mode}>
              <p className="font-mono text-base font-semibold text-foreground mb-1">
                {snippet.title}
              </p>
              <p className="text-sm text-muted mb-4">{snippet.description}</p>
              <CodeBlock code={snippet.code}  />
            </GlowCard>
          ))}
        </div>
      </section>

      <section>
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// TRY IT LIVE"}
        </TextShimmer>

        <h2 className="mt-4 font-mono text-xl font-bold text-foreground">
          Query on-chain identity.
        </h2>
        <p className="mt-3 text-sm text-foreground/70 leading-relaxed max-w-2xl">
          This is what your integration reads. Paste any wallet address to see
          its Entros verification status, Trust Score, and history directly from
          Solana devnet.
        </p>

        <div className="mt-6">
          <IntegratePlayground />
        </div>
      </section>

      <section>
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// USE CASES"}
        </TextShimmer>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {useCaseSnippets.map((snippet) => (
            <GlowCard key={snippet.title} className={snippet.title === "Display verification status" ? "lg:col-span-2" : ""}>
              <p className="font-mono text-base font-semibold text-foreground mb-1">
                {snippet.title}
              </p>
              <p className="text-sm text-muted mb-4">{snippet.description}</p>
              <CodeBlock code={snippet.code} />
            </GlowCard>
          ))}
        </div>
      </section>

      <section>
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// DROP-IN COMPONENTS"}
        </TextShimmer>

        <h2 className="mt-4 font-mono text-xl font-bold text-foreground">
          Self-contained React components.
        </h2>
        <p className="mt-3 text-sm text-foreground/70 leading-relaxed max-w-2xl">
          Copy the source, paste into your Tailwind project, render anywhere. No
          custom UI dependencies, no Entros backend. Each component reads directly
          from Solana via your existing wallet connection.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <GlowCard>
            <div className="flex items-start gap-3">
              <BadgeCheck className="h-6 w-6 text-cyan shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="font-mono text-base font-semibold text-foreground">
                  &lt;EntrosBadge /&gt;
                </p>
                <p className="mt-1 text-sm text-muted">
                  Pill that displays any wallet&apos;s Trust Score. Use in profiles,
                  comments, leaderboards, anywhere humanness matters.
                </p>
              </div>
            </div>
            <Link
              href="/badge-demo"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-cyan hover:text-foreground transition-colors"
            >
              Live demo + source <ArrowRight className="h-4 w-4" />
            </Link>
          </GlowCard>

          <GlowCard>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-cyan shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="font-mono text-base font-semibold text-foreground">
                  &lt;EntrosGate minTrustScore=&#123;N&#125;&gt;
                </p>
                <p className="mt-1 text-sm text-muted">
                  Route guard. Wrap any content, set a threshold, the gate
                  handles wallet connection, identity lookup, and verification
                  prompts.
                </p>
              </div>
            </div>
            <Link
              href="/gate-demo"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-cyan hover:text-foreground transition-colors"
            >
              Live demo + source <ArrowRight className="h-4 w-4" />
            </Link>
          </GlowCard>
        </div>
      </section>

      <section>
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// CONFIGURATION"}
        </TextShimmer>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left font-mono text-xs uppercase tracking-widest text-muted">
                  Option
                </th>
                <th className="px-3 py-2 text-left font-mono text-xs uppercase tracking-widest text-muted">
                  Type
                </th>
                <th className="px-3 py-2 text-left font-mono text-xs uppercase tracking-widest text-muted">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {CONFIG_OPTIONS.map((opt) => (
                <tr key={opt.name} className="border-b border-border/50">
                  <td className="px-3 py-2 font-mono text-cyan">{opt.name}</td>
                  <td className="px-3 py-2 font-mono text-foreground/60">
                    {opt.type}
                  </td>
                  <td className="px-3 py-2 text-foreground/80">
                    {opt.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// PRICING"}
        </TextShimmer>

        <GlowCard className="mt-6">
          <p className="font-mono text-base font-semibold text-foreground mb-2">
            Zero integration cost
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Wallet-connected users pay a small protocol fee per verification
            (~0.005 SOL). Your application reads on-chain state for free via{" "}
            <code className="text-cyan">verifyEntrosAttestation()</code>. No escrow,
            no API keys, no billing relationship. You get verified humans.
            The user pays to prove they&apos;re human.
          </p>
        </GlowCard>
      </section>

      <section>
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// ABUSE PREVENTION"}
        </TextShimmer>

        <h2 className="mt-4 font-mono text-xl font-bold text-foreground">
          Built-in bot resistance.
        </h2>
        <p className="mt-3 text-sm text-foreground/70 leading-relaxed max-w-2xl">
          Every verification costs the user SOL. Synthetic data is rejected
          server-side before reaching the chain. Bot farms must fund thousands
          of wallets, pay per verification, and maintain Trust Score across
          months. You control trust requirements through four mechanisms.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <GlowCard>
            <p className="font-mono text-sm font-semibold text-foreground">Rate limiting</p>
            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
              Cap verifications per IP, per session, or per time window. The
              relayer enforces limits before a transaction reaches the chain.
            </p>
          </GlowCard>
          <GlowCard>
            <p className="font-mono text-sm font-semibold text-foreground">Trust Score thresholds</p>
            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
              Require a minimum Trust Score to access protected features. New
              identities start at zero. High-value actions (airdrops, governance)
              can require weeks of consistent verification history.
            </p>
          </GlowCard>
          <GlowCard>
            <p className="font-mono text-sm font-semibold text-foreground">Protocol fee defense</p>
            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
              Every verification costs the user SOL. Bot farms must fund
              wallets and pay per attempt. The cost scales with the attack.
            </p>
          </GlowCard>
          <GlowCard>
            <p className="font-mono text-sm font-semibold text-foreground">Graduated trust tiers</p>
            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
              First walletless verification is a liveness check. Returning
              verifications build device-bound consistency. Wallet-connected
              mode builds portable, on-chain Trust Score. Match the tier to
              the sensitivity of the action.
            </p>
          </GlowCard>
        </div>
      </section>
    </div>
  );
}
