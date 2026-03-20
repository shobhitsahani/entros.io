"use client";

import { cn } from "@/lib/utils";
import type { VerifyMode } from "@/components/verify/types";

export function VerifyModeToggle({
  mode,
  onChange,
}: {
  mode: VerifyMode;
  onChange: (mode: VerifyMode) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-background p-1">
      <button
        onClick={() => onChange("walletless")}
        className={cn(
          "rounded-full px-5 py-2 text-sm font-medium transition-colors",
          mode === "walletless"
            ? "bg-surface text-cyan"
            : "text-muted hover:text-foreground"
        )}
      >
        Walletless
      </button>
      <button
        onClick={() => onChange("wallet-connected")}
        className={cn(
          "rounded-full px-5 py-2 text-sm font-medium transition-colors",
          mode === "wallet-connected"
            ? "bg-surface text-cyan"
            : "text-muted hover:text-foreground"
        )}
      >
        Wallet
      </button>
    </div>
  );
}
