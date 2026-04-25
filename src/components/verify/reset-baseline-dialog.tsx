"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Confirmation overlay for `reset_identity_state`.
 *
 * Shown when the user's on-chain IdentityState exists but the local
 * baseline is unrecoverable. Makes the consequences of reset explicit
 * before the user signs the transaction — this is a reputation-destroying
 * operation and should not feel casual.
 */
export function ResetBaselineDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus the Cancel button on open — safer default than Confirm for a
  // destructive action.
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Escape-to-cancel for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-baseline-dialog-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-danger/30 bg-danger/10">
            <AlertTriangle
              className="h-5 w-5 text-danger"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="reset-baseline-dialog-title"
              className="font-sans text-lg font-semibold text-foreground"
            >
              Reset baseline?
            </h2>
            <p className="mt-2 text-sm text-foreground/70">
              Your Entros Anchor stays. Your on-chain commitment and verification
              history do not.
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5 text-sm text-foreground/80">
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
            <span>
              Your on-chain commitment is overwritten with a fresh fingerprint
              from this capture.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
            <span>
              Verification count and Trust Score reset to zero. You rebuild
              them over time.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
            <span>
              Your wallet, Entros Anchor token, and SAS attestation are preserved.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
            <span>7-day cooldown before you can reset again.</span>
          </li>
        </ul>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="rounded-full border border-border px-5 py-2 text-sm font-medium text-muted transition-colors hover:border-border-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full border border-danger/30 bg-danger/10 px-5 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/50"
          >
            Reset baseline
          </button>
        </div>
      </div>
    </div>
  );
}
