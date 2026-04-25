"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_IDS } from "@entros/pulse-sdk";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CheckCircle, Loader2, Fingerprint, RotateCcw } from "lucide-react";

function formatTimestamp(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardHistory() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mintTimestamp, setMintTimestamp] = useState<number | null>(null);
  const [reVerifications, setReVerifications] = useState<number[]>([]);
  const [verificationCount, setVerificationCount] = useState(0);
  const [lastResetTimestamp, setLastResetTimestamp] = useState<number>(0);

  useEffect(() => {
    if (!publicKey || !connected) {
      setMintTimestamp(null);
      setReVerifications([]);
      setLastResetTimestamp(0);
      return;
    }
    setLoading(true);
    setError(null);

    // Build history entirely from the IdentityState PDA (authoritative source)
    (async () => {
      const programId = new PublicKey(PROGRAM_IDS.entrosAnchor);
      const [identityPda] = PublicKey.findProgramAddressSync(
        [new TextEncoder().encode("identity"), publicKey.toBuffer()],
        programId
      );
      const account = await connection.getAccountInfo(identityPda);
      if (!account || account.data.length < 207) {
        setMintTimestamp(null);
        setReVerifications([]);
        setLastResetTimestamp(0);
        return;
      }

      const view = new DataView(account.data.buffer, account.data.byteOffset, account.data.byteLength);
      setMintTimestamp(Number(view.getBigInt64(40, true)));

      // verification_count: u32 at offset 56
      //   (8 disc + 32 owner + 8 created + 8 last_verified = 56)
      setVerificationCount(view.getUint32(56, true));

      // recent_timestamps: 52 x i64 at offset 127 (newest at index 0)
      // Only written by successful updateAnchor calls
      const timestamps: number[] = [];
      const slotCount = account.data.length >= 543 ? 52 : 10;
      for (let i = 0; i < slotCount; i++) {
        const ts = Number(view.getBigInt64(127 + i * 8, true));
        if (ts > 0) timestamps.push(ts);
      }
      setReVerifications(timestamps);

      // last_reset_timestamp: i64 at offset 543 (after the 52-slot array).
      // Pre-reset-feature accounts are shorter; guard on length.
      setLastResetTimestamp(
        account.data.length >= 551 ? Number(view.getBigInt64(543, true)) : 0
      );
    })()
      .catch(() => setError("Failed to load verification history"))
      .finally(() => setLoading(false));
  }, [publicKey, connected, connection]);

  if (!connected) return null;

  return (
    <section className="mt-12">
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// VERIFICATION HISTORY"}
      </TextShimmer>

      {loading && (
        <div className="mt-6 flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-cyan animate-spin" />
        </div>
      )}

      {error && (
        <p className="mt-6 text-sm text-muted">{error}</p>
      )}

      {!loading && !error && !mintTimestamp && (
        <p className="mt-6 text-sm text-muted">
          No verification history found. Complete a verification to see entries here.
        </p>
      )}

      {!loading && !error && mintTimestamp && (
        <div className="mt-6 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {reVerifications.map((ts, i) => (
            <div
              key={ts}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface/30 px-5 py-4"
            >
              <CheckCircle className="h-5 w-5 shrink-0 text-solana-green" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">
                  Re-verification #{verificationCount - i}
                </span>
                <p className="mt-0.5 text-xs text-muted">
                  Behavioral consistency confirmed within threshold
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted">
                  {formatTimestamp(ts)}
                </p>
              </div>
            </div>
          ))}

          {lastResetTimestamp > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-danger/20 bg-danger/5 px-5 py-4">
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-danger" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-foreground">Baseline reset</p>
                  <p className="mt-0.5 text-xs text-muted">
                    Fingerprint re-enrolled from this device
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted">
                  {formatTimestamp(lastResetTimestamp)}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-cyan/20 bg-cyan/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <Fingerprint className="h-5 w-5 text-cyan" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {lastResetTimestamp > 0 ? "Anchor minted" : "Initial verification"}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {lastResetTimestamp > 0
                    ? "Entros Anchor PDA and Token-2022 mint created on-chain"
                    : "Behavioral baseline established"}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted">
                {formatTimestamp(mintTimestamp)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
