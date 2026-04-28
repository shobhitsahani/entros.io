"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_IDS } from "@entros/pulse-sdk";
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
      setVerificationCount(view.getUint32(56, true));

      const timestamps: number[] = [];
      const slotCount = account.data.length >= 543 ? 52 : 10;
      for (let i = 0; i < slotCount; i++) {
        const ts = Number(view.getBigInt64(127 + i * 8, true));
        if (ts > 0) timestamps.push(ts);
      }
      setReVerifications(timestamps);

      setLastResetTimestamp(
        account.data.length >= 551 ? Number(view.getBigInt64(543, true)) : 0
      );
    })()
      .catch(() => setError("Failed to load verification history"))
      .finally(() => setLoading(false));
  }, [publicKey, connected, connection]);

  if (!connected) return null;

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
          // VERIFICATION HISTORY
        </span>

        <h2 className="mt-6 max-w-3xl font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
          Every session on-chain<span className="text-cyan">.</span>
        </h2>

        {loading && (
          <div className="mt-12 flex items-center justify-center border border-border py-16">
            <Loader2 className="h-6 w-6 animate-spin text-cyan" />
          </div>
        )}

        {error && (
          <p className="mt-12 text-sm text-foreground/55">{error}</p>
        )}

        {!loading && !error && !mintTimestamp && (
          <p className="mt-12 text-sm text-foreground/55">
            No verification history found. Complete a verification to see
            entries here.
          </p>
        )}

        {!loading && !error && mintTimestamp && (
          <div className="mt-12 max-h-[600px] space-y-px overflow-y-auto border-y border-border bg-border">
            {reVerifications.map((ts, i) => (
              <div
                key={ts}
                className="flex items-center gap-4 bg-background px-6 py-5"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-cyan" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-medium tracking-tight text-foreground">
                    Re-verification #{verificationCount - i}
                  </p>
                  <p className="mt-1 text-xs text-foreground/55">
                    Behavioral consistency confirmed within threshold
                  </p>
                </div>
                <p className="shrink-0 font-mono text-xs text-foreground/55">
                  {formatTimestamp(ts)}
                </p>
              </div>
            ))}

            {lastResetTimestamp > 0 && (
              <div className="flex items-center gap-4 bg-background px-6 py-5">
                <RotateCcw className="h-5 w-5 shrink-0 text-danger" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-medium tracking-tight text-foreground">
                    Baseline reset
                  </p>
                  <p className="mt-1 text-xs text-foreground/55">
                    Fingerprint re-enrolled from this device
                  </p>
                </div>
                <p className="shrink-0 font-mono text-xs text-foreground/55">
                  {formatTimestamp(lastResetTimestamp)}
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 bg-background px-6 py-5">
              <Fingerprint className="h-5 w-5 shrink-0 text-cyan" strokeWidth={1.5} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-medium tracking-tight text-foreground">
                  {lastResetTimestamp > 0 ? "Anchor minted" : "Initial verification"}
                </p>
                <p className="mt-1 text-xs text-foreground/55">
                  {lastResetTimestamp > 0
                    ? "Entros Anchor PDA and Token-2022 mint created on-chain"
                    : "Behavioral baseline established"}
                </p>
              </div>
              <p className="shrink-0 font-mono text-xs text-foreground/55">
                {formatTimestamp(mintTimestamp)}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
