"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_IDS } from "@entros/pulse-sdk";
import { GlowCard } from "@/components/ui/glow-card";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { ArrowRight, Loader2, ShieldAlert } from "lucide-react";

// sha256("account:IdentityState")[0..8] encoded as base58
const IDENTITY_STATE_DISC_B58 = "T7d2447Yv5U";

// SAS program IDs (Solana Attestation Service on devnet)
const SAS_PROGRAM_ID = "22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG";
const ENTROS_CREDENTIAL_PDA = "GaPTkZC6JEGds1G5h645qyUrogx7NWghR2JgjvKQwTDo";

interface OnChainStats {
  totalAnchors: number;
  averageTrustScore: number;
  highestTrustScore: number;
  totalVerifications: number;
  mostRecentTimestamp: number | null;
  attestationCount: number;
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

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <GlowCard>
      <p className="text-xs font-mono uppercase tracking-widest text-muted">
        {label}
      </p>
      <p className="mt-3 text-4xl font-mono font-bold text-foreground break-all">
        {value}
      </p>
      {sub && <p className="mt-2 text-xs text-muted">{sub}</p>}
    </GlowCard>
  );
}

export function ProtocolStats() {
  const { connection } = useConnection();
  const [stats, setStats] = useState<OnChainStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      const programId = new PublicKey(PROGRAM_IDS.entrosAnchor);
      const sasProgramId = new PublicKey(SAS_PROGRAM_ID);

      const [accounts, attestations] = await Promise.all([
        connection.getProgramAccounts(programId, {
          filters: [
            { memcmp: { offset: 0, bytes: IDENTITY_STATE_DISC_B58 } },
          ],
          dataSlice: { offset: 48, length: 14 }, // lastVerif(8) + count(4) + trust(2)
        }),
        // SAS attestation layout: 1 byte disc + 32 bytes nonce + 32 bytes credential = offset 33
        connection.getProgramAccounts(sasProgramId, {
          filters: [
            { memcmp: { offset: 33, bytes: ENTROS_CREDENTIAL_PDA } },
          ],
          dataSlice: { offset: 0, length: 0 },
        }),
      ]);

      if (cancelled) return;

      const attestationCount = attestations.length;

      if (accounts.length === 0) {
        setStats({
          totalAnchors: 0,
          averageTrustScore: 0,
          highestTrustScore: 0,
          totalVerifications: 0,
          mostRecentTimestamp: null,
          attestationCount,
        });
        return;
      }

      let totalTrust = 0;
      let highestTrust = 0;
      let totalVerifications = 0;
      let mostRecentTimestamp = 0;

      for (const { account } of accounts) {
        const data = account.data;
        if (data.length < 14) continue;

        const view = new DataView(
          data.buffer,
          data.byteOffset,
          data.byteLength
        );

        const lastVerif = Number(view.getBigInt64(0, true));
        const count = view.getUint32(8, true);
        const trust = view.getUint16(12, true);

        totalTrust += trust;
        if (trust > highestTrust) highestTrust = trust;
        totalVerifications += count + 1;
        if (lastVerif > mostRecentTimestamp) mostRecentTimestamp = lastVerif;
      }

      if (cancelled) return;

      setStats({
        totalAnchors: accounts.length,
        averageTrustScore:
          accounts.length > 0
            ? Math.round(totalTrust / accounts.length)
            : 0,
        highestTrustScore: highestTrust,
        totalVerifications,
        mostRecentTimestamp: mostRecentTimestamp > 0 ? mostRecentTimestamp : null,
        attestationCount,
      });
    })()
      .catch(() => { if (!cancelled) setError("Failed to fetch on-chain stats. The RPC may be rate-limited—try again shortly."); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [connection]);

  return (
    <div>
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// PROTOCOL METRICS"}
      </TextShimmer>

      {loading && (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 py-16">
          <Loader2 className="h-8 w-8 text-cyan animate-spin" />
          <p className="font-mono text-xs text-muted tracking-widest uppercase">
            Reading from Solana devnet…
          </p>
        </div>
      )}

      {error && (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 py-16">
          <ShieldAlert className="h-8 w-8 text-danger" strokeWidth={1.5} />
          <p className="text-sm text-muted text-center max-w-sm">{error}</p>
        </div>
      )}

      {!loading && !error && stats && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-cyan/20 bg-cyan/5 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-cyan">
                Devnet pilot · open to all
              </p>
              <p className="mt-1 text-sm text-foreground/70">
                Every metric below is on-chain truth, queried live from Solana devnet. The pilot is open — verify your humanness and join.
              </p>
            </div>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 text-sm text-cyan hover:text-foreground transition-colors shrink-0"
            >
              Verify now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              label="Entros Anchors minted"
              value={stats.totalAnchors.toLocaleString()}
              sub="Total IdentityState PDAs on devnet"
            />
            <StatCard
              label="Total verifications"
              value={stats.totalVerifications.toLocaleString()}
              sub="Cumulative across all anchors"
            />
            <StatCard
              label="Average trust score"
              value={stats.averageTrustScore}
              sub="Mean across all active anchors"
            />
            <StatCard
              label="Highest trust score"
              value={stats.highestTrustScore}
              sub="Top anchor on the network"
            />
            <StatCard
              label="SAS attestations"
              value={stats.attestationCount.toLocaleString()}
              sub="Issued via Solana Attestation Service"
            />
          </div>
          <GlowCard>
            <p className="text-xs font-mono uppercase tracking-widest text-muted">
              Most recent verification
            </p>
            {stats.mostRecentTimestamp ? (
              <>
                <p className="mt-3 text-2xl font-mono font-bold text-foreground">
                  {formatTimestamp(stats.mostRecentTimestamp)}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                  <span className="font-mono text-xs text-cyan">
                    Live · Solana devnet
                  </span>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted">No verifications recorded yet</p>
            )}
          </GlowCard>
        </div>
      )}

      {!loading && !error && stats && (
        <div className="mt-8 rounded-xl border border-border bg-surface/30 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan animate-pulse shrink-0" />
            <p className="font-mono text-xs text-muted">
              Data read live from{" "}
              <span className="text-cyan">
                GZYwTp2o…q4b2
              </span>{" "}
              · entros-anchor program
            </p>
          </div>
          <p className="font-mono text-xs text-muted">Solana devnet</p>
        </div>
      )}
    </div>
  );
}
