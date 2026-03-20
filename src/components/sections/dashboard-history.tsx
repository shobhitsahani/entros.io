"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { mockHistory } from "@/data/mock-history";
import { CheckCircle, XCircle } from "lucide-react";

function formatTimestamp(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardHistory() {
  const { connected } = useWallet();

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

      <div className="mt-6 space-y-3">
        {mockHistory.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface/30 px-5 py-4"
          >
            {entry.status === "verified" ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-solana-green" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 text-danger" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-medium text-foreground">
                  {entry.status === "verified" ? "Verified" : "Failed"}
                </span>
                {entry.trustScoreDelta > 0 && (
                  <span className="text-xs text-solana-green font-mono">
                    +{entry.trustScoreDelta} Trust
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs font-mono text-muted truncate">
                {entry.commitmentHash}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs text-muted">
                {formatTimestamp(entry.timestamp)}
              </p>
              <p className="mt-0.5 text-xs font-mono text-foreground/40 truncate max-w-[100px]">
                {entry.txSignature}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
