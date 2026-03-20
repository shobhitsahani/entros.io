"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { fetchVerificationHistory, type VerificationHistoryEntry } from "@/lib/on-chain";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

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
  const [history, setHistory] = useState<VerificationHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey || !connected) {
      setHistory([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetchVerificationHistory(publicKey.toBase58(), connection)
      .then(setHistory)
      .catch(() => setError("Verification history unavailable"))
      .finally(() => setLoading(false));
  }, [publicKey, connected, connection]);

  if (!connected) return null;

  return (
    <section className="mt-12">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
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

      {!loading && !error && history.length === 0 && (
        <p className="mt-6 text-sm text-muted">
          No verification history found. Complete a verification to see entries here.
        </p>
      )}

      {!loading && history.length > 0 && (
        <div className="mt-6 space-y-3">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface/30 px-5 py-4"
            >
              {entry.isValid ? (
                <CheckCircle className="h-5 w-5 shrink-0 text-solana-green" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0 text-danger" />
              )}

              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">
                  {entry.isValid ? "Verified" : "Failed"}
                </span>
                <p className="mt-0.5 text-xs font-mono text-muted truncate">
                  {entry.commitmentHash}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs text-muted">
                  {formatTimestamp(entry.timestamp)}
                </p>
                <p className="mt-0.5 text-xs font-mono text-foreground/40 truncate max-w-[100px]">
                  {entry.id.slice(0, 8)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
