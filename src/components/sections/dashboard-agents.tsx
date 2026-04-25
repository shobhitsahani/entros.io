"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, type Connection } from "@solana/web3.js";
import {
  attestAgentOperator,
  getAgentHumanOperator,
  PROGRAM_IDS,
  type AgentHumanOperator,
} from "@entros/pulse-sdk";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Bot, CheckCircle, ExternalLink, Loader2, Search, Link2 } from "lucide-react";
import { explorerUrl } from "@/lib/explorer";
import { fetchAgentsByOwner, type OwnedAgent } from "@/lib/agent-indexer";

interface OwnedAgentWithStatus extends OwnedAgent {
  entrosOperator: AgentHumanOperator | null;
  liveTrustScore: number | null;
  queryFailed: boolean;
}

async function fetchLiveTrustScore(
  walletAddress: string,
  connection: Connection,
): Promise<number | null> {
  try {
    const programId = new PublicKey(PROGRAM_IDS.entrosAnchor);
    const walletPubkey = new PublicKey(walletAddress);
    const [identityPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode("identity"), walletPubkey.toBuffer()],
      programId,
    );
    const accountInfo = await connection.getAccountInfo(identityPda);
    if (!accountInfo || accountInfo.data.length < 62) return null;
    const view = new DataView(
      accountInfo.data.buffer,
      accountInfo.data.byteOffset,
      accountInfo.data.byteLength,
    );
    return view.getUint16(60, true);
  } catch {
    return null;
  }
}

function formatTimestamp(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(addr: string): string {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function DashboardAgents() {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;
  const { connection } = useConnection();

  // Auto-detect state
  const [ownedAgents, setOwnedAgents] = useState<OwnedAgentWithStatus[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [indexerError, setIndexerError] = useState(false);
  const [attestingAsset, setAttestingAsset] = useState<string | null>(null);
  const [attestErrorAsset, setAttestErrorAsset] = useState<{ asset: string; message: string } | null>(null);

  // Manual check state (existing)
  const [agentAsset, setAgentAsset] = useState("");
  const [operator, setOperator] = useState<AgentHumanOperator | null>(null);
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [attesting, setAttesting] = useState(false);
  const [attestResult, setAttestResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connected || !publicKey) {
      setOwnedAgents([]);
      setScanned(false);
      setIndexerError(false);
      return;
    }

    let cancelled = false;
    setLoadingAgents(true);
    setScanned(false);
    setIndexerError(false);

    (async () => {
      const { agents, error: indexerFailed } = await fetchAgentsByOwner(publicKey.toBase58());
      if (cancelled) return;

      if (indexerFailed) {
        setIndexerError(true);
        setOwnedAgents([]);
        setScanned(true);
        return;
      }

      const withStatus = await Promise.all(
        agents.map(async (agent): Promise<OwnedAgentWithStatus> => {
          try {
            const entrosOperator = await getAgentHumanOperator(agent.asset, connection);
            const liveTrustScore = entrosOperator
              ? await fetchLiveTrustScore(entrosOperator.wallet, connection)
              : null;
            return { ...agent, entrosOperator, liveTrustScore, queryFailed: false };
          } catch {
            return { ...agent, entrosOperator: null, liveTrustScore: null, queryFailed: true };
          }
        }),
      );

      if (cancelled) return;
      setOwnedAgents(withStatus);
      setScanned(true);
    })().finally(() => {
      if (!cancelled) setLoadingAgents(false);
    });

    return () => {
      cancelled = true;
    };
  }, [connected, publicKey, connection]);

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
    }
    setAttesting(false);
  }

  async function handleAttestOwned(asset: string) {
    setAttestingAsset(asset);
    setAttestErrorAsset(null);
    try {
      const result = await attestAgentOperator(asset, {
        wallet: wallet.wallet?.adapter ?? wallet,
        connection,
      });
      if (result.success) {
        const updated = await getAgentHumanOperator(asset, connection);
        const liveTrustScore = updated
          ? await fetchLiveTrustScore(updated.wallet, connection)
          : null;
        setOwnedAgents((prev) =>
          prev.map((a) =>
            a.asset === asset
              ? { ...a, entrosOperator: updated, liveTrustScore, queryFailed: false }
              : a,
          ),
        );
      } else {
        setAttestErrorAsset({ asset, message: result.error ?? "Attestation failed" });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Attestation failed";
      setAttestErrorAsset({ asset, message });
    } finally {
      setAttestingAsset(null);
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
        Link your Entros identity to your registered AI agents on the Solana Agent
        Registry. Immutable, on-chain proof that a verified human operates the
        agent.
      </p>

      {/* Auto-detected owned agents */}
      <div className="mt-6">
        <GlowCard>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-xs font-mono uppercase tracking-widest text-muted">
              Your registered agents
            </p>
            {loadingAgents && <Loader2 className="h-3.5 w-3.5 text-cyan animate-spin" />}
          </div>

          {loadingAgents && (
            <p className="text-sm text-muted">Scanning your wallet for agents…</p>
          )}

          {!loadingAgents && scanned && indexerError && (
            <p className="text-sm text-muted">
              Could not reach the agent registry. Use the field below to check a specific agent manually.
            </p>
          )}

          {!loadingAgents && scanned && !indexerError && ownedAgents.length === 0 && (
            <p className="text-sm text-muted">
              No agents found on this wallet. Use the field below to check or attest a specific agent.
            </p>
          )}

          {!loadingAgents && ownedAgents.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ownedAgents.map((agent) => {
                const attested = agent.entrosOperator !== null;
                return (
                  <div
                    key={agent.asset}
                    className={`rounded-xl border p-4 ${
                      attested
                        ? "border-solana-green/20 bg-solana-green/5"
                        : "border-border bg-surface/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {attested ? (
                        <CheckCircle className="h-4 w-4 text-solana-green shrink-0" />
                      ) : (
                        <Bot className="h-4 w-4 text-muted shrink-0" strokeWidth={1.5} />
                      )}
                      <p className="text-xs font-mono text-foreground/80">
                        {truncate(agent.asset)}
                      </p>
                      <a
                        href={explorerUrl(agent.asset)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-cyan hover:text-foreground transition-colors"
                        aria-label="View agent on Solana Explorer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    {attested && agent.entrosOperator && (
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="font-mono uppercase tracking-widest text-muted">
                            Trust Score (Live)
                          </p>
                          <p className="mt-0.5 font-mono font-bold text-foreground">
                            {agent.liveTrustScore ?? agent.entrosOperator.trustScore}
                          </p>
                          {agent.liveTrustScore !== null &&
                            agent.liveTrustScore !== agent.entrosOperator.trustScore && (
                              <p className="mt-0.5 text-[10px] text-muted">
                                {agent.entrosOperator.trustScore} at agent registration
                              </p>
                            )}
                        </div>
                        <div>
                          <p className="font-mono uppercase tracking-widest text-muted">
                            Verified
                          </p>
                          <p className="mt-0.5 font-mono text-foreground">
                            {formatTimestamp(agent.entrosOperator.verifiedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                    {!attested && agent.queryFailed && (
                      <p className="mt-3 text-xs text-muted">
                        Status check failed. Refresh to retry.
                      </p>
                    )}
                    {!attested && !agent.queryFailed && (
                      <button
                        onClick={() => handleAttestOwned(agent.asset)}
                        disabled={attestingAsset === agent.asset}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-cyan hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        {attestingAsset === agent.asset ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Link2 className="h-3.5 w-3.5" />
                        )}
                        {attestingAsset === agent.asset ? "Attesting…" : "Attest with Entros"}
                      </button>
                    )}
                    {attestErrorAsset?.asset === agent.asset && (
                      <p className="mt-2 text-xs text-danger">
                        {attestErrorAsset.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </GlowCard>
      </div>

      {/* Manual check (fallback / for non-owned agents) */}
      <div className="mt-6">
        <GlowCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="agent-asset"
                className="block text-xs font-mono uppercase tracking-widest text-muted mb-2"
              >
                Check any agent address
              </label>
              <input
                id="agent-asset"
                type="text"
                placeholder="Paste any agent's Metaplex Core asset address..."
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
                    No Entros attestation found
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    This agent has no verified human operator linked via Entros.
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
                  {attesting ? "Attesting..." : "Attest with Entros"}
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
                    This agent is attested with an immutable Entros identity link.
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
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xs font-mono text-foreground/70 truncate">
                      {operator.wallet}
                    </p>
                    <a
                      href={explorerUrl(operator.wallet)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-cyan hover:text-foreground transition-colors"
                      aria-label="View operator on Solana Explorer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
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
