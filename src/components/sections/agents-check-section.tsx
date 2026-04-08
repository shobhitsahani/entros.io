"use client";

import { useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  getAgentHumanOperator,
  type AgentHumanOperator,
} from "@iam-protocol/pulse-sdk";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";
import { Bot, CheckCircle, Loader2, Search } from "lucide-react";

function formatTimestamp(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AgentsCheckSection() {
  const { connection } = useConnection();
  const [agentAsset, setAgentAsset] = useState("");
  const [operator, setOperator] = useState<AgentHumanOperator | null>(null);
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck() {
    if (!agentAsset.trim()) return;
    setChecking(true);
    setError(null);
    setOperator(null);
    setChecked(false);

    try {
      const result = await getAgentHumanOperator(agentAsset.trim(), connection);
      setOperator(result);
      setChecked(true);
    } catch {
      setError("Invalid asset address or network error.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="mt-16">
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// CHECK AN AGENT"}
      </TextShimmer>
      <p className="mt-4 text-sm text-foreground/70 max-w-2xl">
        Enter any agent&apos;s asset address to check if it has a verified human
        operator via IAM.
      </p>

      <div className="mt-6">
        <GlowCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="check-agent-asset"
                className="block text-xs font-mono uppercase tracking-widest text-muted mb-2"
              >
                Agent Asset Address
              </label>
              <input
                id="check-agent-asset"
                type="text"
                placeholder="Paste a Solana Agent Registry asset address..."
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-mono text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-cyan/50 transition-colors"
                value={agentAsset}
                onChange={(e) => {
                  setAgentAsset(e.target.value);
                  setChecked(false);
                  setOperator(null);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              />
            </div>
            <button
              onClick={handleCheck}
              disabled={checking || !agentAsset.trim()}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-mono text-foreground transition-colors hover:border-cyan/50 hover:text-cyan disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Check
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-danger">{error}</p>}

          {checked && !operator && !error && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-surface/30 p-5">
              <Bot className="h-6 w-6 text-muted" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">
                  No IAM attestation
                </p>
                <p className="text-xs text-muted mt-0.5">
                  This agent has no verified human operator linked via IAM
                  Protocol.
                </p>
              </div>
            </div>
          )}

          {operator && (
            <div className="mt-6 rounded-xl border border-solana-green/20 bg-solana-green/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-solana-green" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Verified Human Operator
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Immutable IAM attestation confirmed on-chain.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted">
                    Trust Score
                  </p>
                  <p className="mt-1 text-2xl font-mono font-bold text-foreground">
                    {operator.trustScore}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted">
                    Verified At
                  </p>
                  <p className="mt-1 text-sm font-mono text-foreground">
                    {formatTimestamp(operator.verifiedAt)}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-mono uppercase tracking-widest text-muted">
                    Operator Wallet
                  </p>
                  <p className="mt-1 text-xs font-mono text-foreground/70 break-all">
                    {operator.wallet}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-mono uppercase tracking-widest text-muted">
                    IAM Anchor PDA
                  </p>
                  <p className="mt-1 text-xs font-mono text-foreground/70 break-all">
                    {operator.anchorPda}
                  </p>
                </div>
              </div>
            </div>
          )}
        </GlowCard>
      </div>

      <p className="mt-6 text-xs text-muted text-center">
        Try with:{" "}
        <button
          onClick={() => {
            setAgentAsset("m8b6ADwZUqL3JNazingq5VKJBmFeS8Rz1w487i4must");
            setChecked(false);
            setOperator(null);
          }}
          className="text-cyan hover:text-foreground transition-colors font-mono"
        >
          m8b6AD...4must
        </button>
        {" "}(IAM test agent on devnet)
      </p>
    </section>
  );
}
