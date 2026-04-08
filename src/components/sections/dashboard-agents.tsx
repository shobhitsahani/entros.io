"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  attestAgentOperator,
  getAgentHumanOperator,
  type AgentHumanOperator,
} from "@iam-protocol/pulse-sdk";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Bot, CheckCircle, Loader2, Search, Link2 } from "lucide-react";

function formatTimestamp(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardAgents() {
  const wallet = useWallet();
  const { connected } = wallet;
  const { connection } = useConnection();

  const [agentAsset, setAgentAsset] = useState("");
  const [operator, setOperator] = useState<AgentHumanOperator | null>(null);
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [attesting, setAttesting] = useState(false);
  const [attestResult, setAttestResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!connected) return null;

  async function handleCheck() {
    if (!agentAsset.trim()) return;
    setChecking(true);
    setError(null);
    setOperator(null);
    setChecked(false);
    setAttestResult(null);

    try {
      const result = await getAgentHumanOperator(agentAsset.trim(), connection);
      setOperator(result);
      setChecked(true);
    } catch {
      setError("Failed to query agent. Check the asset address.");
    } finally {
      setChecking(false);
    }
  }

  async function handleAttest() {
    if (!agentAsset.trim()) return;
    setAttesting(true);
    setError(null);
    setAttestResult(null);

    try {
      const result = await attestAgentOperator(agentAsset.trim(), {
        wallet: wallet.wallet?.adapter ?? wallet,
        connection,
      });

      if (result.success) {
        setAttestResult(result.signature ?? "Success");
        const updated = await getAgentHumanOperator(agentAsset.trim(), connection);
        setOperator(updated);
      } else {
        setError(result.error ?? "Attestation failed");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Attestation failed");
    } finally {
      setAttesting(false);
    }
  }

  return (
    <section className="mt-12">
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// AI AGENTS"}
      </TextShimmer>

      <p className="mt-4 text-sm text-muted max-w-2xl">
        Link your IAM identity to your registered AI agents on the Solana Agent
        Registry. Immutable, on-chain proof that a verified human operates the
        agent.
      </p>

      <div className="mt-6">
        <GlowCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="agent-asset"
                className="block text-xs font-mono uppercase tracking-widest text-muted mb-2"
              >
                Agent Asset Address
              </label>
              <input
                id="agent-asset"
                type="text"
                placeholder="Paste your agent's Metaplex Core asset address..."
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-mono text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-cyan/50 transition-colors"
                value={agentAsset}
                onChange={(e) => {
                  setAgentAsset(e.target.value);
                  setChecked(false);
                  setOperator(null);
                  setAttestResult(null);
                  setError(null);
                }}
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
              Check Agent
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-danger">{error}</p>
          )}

          {checked && !operator && !error && (
            <div className="mt-6 rounded-xl border border-border bg-surface/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="h-6 w-6 text-muted" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    No IAM attestation found
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    This agent has no verified human operator linked via IAM.
                  </p>
                </div>
              </div>
              <ShimmerButton
                className="text-sm font-medium"
                onClick={handleAttest}
                disabled={attesting}
              >
                <span className="flex items-center gap-2">
                  {attesting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                  {attesting ? "Attesting..." : "Attest with IAM"}
                </span>
              </ShimmerButton>
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
                    This agent is attested with an immutable IAM identity link.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted">
                    Trust Score
                  </p>
                  <p className="mt-1 text-lg font-mono font-bold text-foreground">
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
                  <p className="mt-1 text-xs font-mono text-foreground/70 truncate">
                    {operator.wallet}
                  </p>
                </div>
              </div>
            </div>
          )}

          {attestResult && (
            <p className="mt-4 text-xs text-solana-green font-mono">
              Attestation confirmed: {attestResult.slice(0, 20)}...
            </p>
          )}
        </GlowCard>
      </div>
    </section>
  );
}
