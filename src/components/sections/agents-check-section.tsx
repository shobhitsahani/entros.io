"use client";

import { useState, useEffect, useRef } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  getAgentHumanOperator,
  type AgentHumanOperator,
} from "@iam-protocol/pulse-sdk";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";
import { Bot, CheckCircle, ExternalLink, Loader2, Search } from "lucide-react";
import { explorerUrl } from "@/lib/explorer";

const TEST_AGENT = "m8b6ADwZUqL3JNazingq5VKJBmFeS8Rz1w487i4must";

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
  const [liveTrustScore, setLiveTrustScore] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoChecked = useRef(false);
  const requestId = useRef(0);

  async function fetchLiveTrustScore(walletAddress: string) {
    try {
      const { PublicKey } = await import("@solana/web3.js");
      const programId = new PublicKey("GZYwTp2ozeuRA5Gof9vs4ya961aANcJBdUzB7LN6q4b2");
      const walletPubkey = new PublicKey(walletAddress);
      const [identityPda] = PublicKey.findProgramAddressSync(
        [new TextEncoder().encode("identity"), walletPubkey.toBuffer()],
        programId
      );
      const accountInfo = await connection.getAccountInfo(identityPda);
      if (!accountInfo || accountInfo.data.length < 62) return null;
      const view = new DataView(
        accountInfo.data.buffer,
        accountInfo.data.byteOffset,
        accountInfo.data.byteLength
      );
      return view.getUint16(60, true);
    } catch {
      return null;
    }
  }

  async function runCheck(asset: string) {
    if (!asset.trim()) return;
    const thisRequest = ++requestId.current;
    setChecking(true);
    setError(null);
    setOperator(null);
    setLiveTrustScore(null);
    setChecked(false);

    try {
      const result = await getAgentHumanOperator(asset.trim(), connection);
      if (requestId.current !== thisRequest) return;
      setOperator(result);
      setChecked(true);

      if (result?.wallet) {
        const live = await fetchLiveTrustScore(result.wallet);
        if (requestId.current === thisRequest) setLiveTrustScore(live);
      }
    } catch {
      if (requestId.current !== thisRequest) return;
      setError("Invalid asset address or network error.");
    } finally {
      if (requestId.current === thisRequest) setChecking(false);
    }
  }

  // Auto-check the test agent on mount so judges see a live result immediately
  useEffect(() => {
    if (autoChecked.current) return;
    autoChecked.current = true;

    setAgentAsset(TEST_AGENT);
    runCheck(TEST_AGENT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  return (
    <section>
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
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
                  requestId.current++;
                  setAgentAsset(e.target.value);
                  setChecked(false);
                  setOperator(null);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && runCheck(agentAsset)}
              />
            </div>
            <button
              onClick={() => runCheck(agentAsset)}
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
              <div className="flex items-center gap-3 mb-5">
                <CheckCircle className="h-6 w-6 text-solana-green" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Verified Human Operator
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Immutable on-chain attestation via{" "}
                    <span className="text-cyan font-mono">
                      iam:human-operator
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted">
                    Trust Score (Live)
                  </p>
                  <p className="mt-1 text-3xl font-mono font-bold text-foreground">
                    {liveTrustScore !== null ? liveTrustScore : operator.trustScore}
                  </p>
                  {liveTrustScore !== null && liveTrustScore !== operator.trustScore && (
                    <p className="mt-1 text-xs text-muted">
                      {operator.trustScore} at attestation
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted">
                    Attested At
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
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xs font-mono text-foreground/70 break-all">
                      {operator.anchorPda}
                    </p>
                    <a
                      href={explorerUrl(operator.anchorPda)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-cyan hover:text-foreground transition-colors"
                      aria-label="View on Solana Explorer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
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
            setAgentAsset(TEST_AGENT);
            runCheck(TEST_AGENT);
          }}
          className="text-cyan hover:text-foreground transition-colors font-mono"
        >
          m8b6AD...4must
        </button>{" "}
        (IAM test agent on devnet)
      </p>
    </section>
  );
}
