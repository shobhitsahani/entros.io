"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_IDS } from "@iam-protocol/pulse-sdk";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CheckCircle, Loader2, Fingerprint } from "lucide-react";

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

  useEffect(() => {
    if (!publicKey || !connected) {
      setMintTimestamp(null);
      setReVerifications([]);
      return;
    }
    setLoading(true);
    setError(null);

    // Build history entirely from the IdentityState PDA (authoritative source)
    (async () => {
      const programId = new PublicKey(PROGRAM_IDS.iamAnchor);
      const [identityPda] = PublicKey.findProgramAddressSync(
        [new TextEncoder().encode("identity"), publicKey.toBuffer()],
        programId
      );
      const account = await connection.getAccountInfo(identityPda);
      if (!account || account.data.length < 207) {
        setMintTimestamp(null);
        setReVerifications([]);
        return;
      }

      const view = new DataView(account.data.buffer, account.data.byteOffset, account.data.byteLength);
      setMintTimestamp(Number(view.getBigInt64(40, true)));

      // recent_timestamps: 10 x i64 at offset 127 (newest at index 0)
      // Only written by successful updateAnchor calls
      const timestamps: number[] = [];
      for (let i = 0; i < 10; i++) {
        const ts = Number(view.getBigInt64(127 + i * 8, true));
        if (ts > 0) timestamps.push(ts);
      }
      setReVerifications(timestamps);
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
                  Re-verification #{reVerifications.length - i}
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

          <div className="flex items-center justify-between rounded-lg border border-cyan/20 bg-cyan/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <Fingerprint className="h-5 w-5 text-cyan" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">Initial verification</p>
                <p className="mt-0.5 text-xs text-muted">Behavioral baseline established</p>
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
