"use client";

import { integrationSnippets } from "@/data/integration-snippets";
import { CodeBlock } from "@/components/ui/code-block";
import { GlowCard } from "@/components/ui/glow-card";
import { TextShimmer } from "@/components/ui/text-shimmer";

const CONFIG_OPTIONS = [
  { name: "cluster", type: '"devnet" | "mainnet-beta"', description: "Solana cluster to connect to" },
  { name: "rpcEndpoint", type: "string", description: "Custom RPC URL (optional)" },
  { name: "relayerUrl", type: "string", description: "IAM relayer endpoint for walletless mode" },
  { name: "relayerApiKey", type: "string", description: "API key identifying your integrator escrow account" },
  { name: "wasmUrl", type: "string", description: "Path to iam_hamming.wasm circuit artifact" },
  { name: "zkeyUrl", type: "string", description: "Path to iam_hamming_final.zkey proving key" },
  { name: "threshold", type: "number", description: "Hamming distance threshold (default: 96)" },
];

export function IntegrateGuide() {
  return (
    <div className="space-y-16">
      <section>
        <TextShimmer
          as="span"
          className="font-mono text-sm tracking-widest uppercase"
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
              code="npm install @iam-protocol/pulse-sdk"
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
          className="font-mono text-sm tracking-widest uppercase"
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
          className="font-mono text-sm tracking-widest uppercase"
          duration={3}
        >
          {"// PRICING"}
        </TextShimmer>

        <GlowCard className="mt-6">
          <p className="font-mono text-base font-semibold text-foreground mb-2">
            Integrator-pays model
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Users never pay. Deposit SOL or USDC into your integrator escrow
            account. Each verification costs ~$0.01 — the relayer submits the
            on-chain transaction and deducts from your balance. First 1,000
            verifications are free.
          </p>
        </GlowCard>
      </section>
    </div>
  );
}
