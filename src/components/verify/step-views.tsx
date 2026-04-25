"use client";

import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const STAGE_SUBTITLES: Record<string, string> = {
  "Extracting features...": "Analyzing voice, motion, and touch data",
  "Validating...": "Server-side feature validation",
  "Computing proof...": "Generating zero-knowledge proof",
  "Submitting to Solana...": "Writing verification on-chain",
};

export function ProvingView({ stage }: { stage?: string }) {
  const label = stage || "Processing...";
  const subtitle = (stage && STAGE_SUBTITLES[stage]) || "Please wait";

  return (
    <div className="text-center space-y-4">
      <Loader2 className="mx-auto h-8 w-8 text-cyan animate-spin" />
      <p className="font-mono text-sm text-foreground">
        {label}
      </p>
      <p className="text-xs text-muted">
        {subtitle}
      </p>
    </div>
  );
}

export function SigningView() {
  return (
    <div className="text-center space-y-4">
      <Loader2 className="mx-auto h-8 w-8 text-solana-purple animate-spin" />
      <p className="font-mono text-sm text-foreground">
        Waiting for wallet signature...
      </p>
      <p className="text-xs text-muted">
        Approve the transaction in your wallet
      </p>
    </div>
  );
}

export function VerifiedView({
  commitment,
  txSignature,
  subtitle,
  onReset,
  title = "Verified",
  tryAgainLabel = "Verify again",
}: {
  commitment: string;
  txSignature?: string;
  subtitle: string;
  onReset: () => void;
  /** Success headline. Pass "Baseline reset" for reset flows. */
  title?: string;
  /** Label for the action that starts a new verification cycle. */
  tryAgainLabel?: string;
}) {
  return (
    <div className="text-center space-y-6">
      <CheckCircle className="mx-auto h-12 w-12 text-solana-green" />
      <div>
        <p className="font-sans text-xl font-semibold text-foreground">
          {title}
        </p>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      <div className="mx-auto max-w-sm space-y-3">
        <div className="rounded-lg border border-border bg-surface/50 p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">
            Commitment
          </p>
          <p className="font-mono text-xs text-foreground/70 break-all">
            {commitment}
          </p>
        </div>
        {txSignature && (
          <div className="rounded-lg border border-border bg-surface/50 p-4">
            <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">
              Transaction
            </p>
            <p className="font-mono text-xs text-foreground/70 break-all">
              {txSignature}
            </p>
          </div>
        )}
      </div>
      <button
        onClick={onReset}
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        {tryAgainLabel}
      </button>
    </div>
  );
}

function isRelayerError(error: string): boolean {
  return (
    error.includes("DOCTYPE") ||
    error.includes("Failed to fetch") ||
    error.includes("NetworkError") ||
    error.includes("localhost")
  );
}

/**
 * Detects the "on-chain anchor exists, local baseline is gone" failure
 * surfaced from `pulse-sdk/src/pulse.ts:278-285`. The stable substring is
 * "baseline is missing" — guarded by a reset.test.ts assertion in the SDK
 * to prevent silent copy drift.
 */
function isMissingBaselineError(error: string): boolean {
  return error.includes("baseline is missing");
}

export function FailedView({
  error,
  onReset,
  onResetBaseline,
}: {
  error: string;
  onReset: () => void;
  onResetBaseline?: () => void;
}) {
  const relayerDown = isRelayerError(error);
  const missingBaseline = !relayerDown && isMissingBaselineError(error);
  const canResetBaseline = missingBaseline && typeof onResetBaseline === "function";

  return (
    <div className="text-center space-y-6">
      <AlertCircle className="mx-auto h-12 w-12 text-danger" />
      <div>
        <p className="font-sans text-xl font-semibold text-foreground">
          {relayerDown
            ? "Relayer not connected"
            : missingBaseline
              ? "Baseline missing on this device"
              : "Verification failed"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {relayerDown
            ? "The Entros relayer service is not running. Verification requires a live relayer connected to Solana devnet."
            : missingBaseline
              ? "Your Entros Anchor exists on-chain, but the encrypted baseline that proves continuity is not on this device. You can reset your baseline to re-enroll from this device."
              : error}
        </p>
        {relayerDown && (
          <p className="mt-2 text-xs text-muted">
            This is a devnet demo. End-to-end verification will be available when the relayer is deployed.
          </p>
        )}
      </div>
      <div className="flex flex-col-reverse gap-2 items-center sm:flex-row sm:justify-center">
        <button
          onClick={onReset}
          className="rounded-full border border-border px-6 py-2 text-sm text-muted hover:text-foreground hover:border-border-hover transition-colors"
        >
          {canResetBaseline ? "Cancel" : "Try again"}
        </button>
        {canResetBaseline && (
          <button
            onClick={onResetBaseline}
            className="rounded-full border border-danger/30 bg-danger/10 px-6 py-2 text-sm font-medium text-danger hover:bg-danger/20 transition-colors"
          >
            Reset baseline
          </button>
        )}
      </div>
    </div>
  );
}
