"use client";

import { CheckCircle, AlertCircle, ExternalLink, Loader2, RefreshCcw } from "lucide-react";

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

/**
 * Per-category hint for soft-rejected verifications. Keyed by the validator's
 * safe reason label (`pulse-sdk` `VerificationResult.reason`). Hint copy
 * intentionally avoids technique names ("phrase content binding", "temporal
 * coupling", "Whisper", "SimHash", etc.) per the public-copy specificity
 * rule—we describe what the user can DO, not what we measured.
 *
 * Keys must stay in sync with `entros-validation::ReasonCode::safe_label`.
 */
const SOFT_HINT: Record<string, string> = {
  variance_floor:
    "Your signals were a bit flat. Try moving more and speaking with normal volume.",
  entropy_bounds:
    "Your gestures and speech were a bit too uniform. Try varying both naturally.",
  temporal_coupling_low:
    "Speak and move at the same time—they were a bit out of sync.",
  phrase_content_mismatch:
    "Read the phrase clearly at a normal pace, exactly as shown.",
  validation_unavailable:
    "We couldn't reach the verification service. Check your connection and try again.",
};

const SOFT_HINT_FALLBACK =
  "Something didn't come through cleanly. Give it another shot with natural movement and clear speech.";

/**
 * Soft-rejected verification—the validator returned a user-recoverable
 * reason and the parent's retry budget is non-zero. Distinct from
 * `FailedView` so the visual treatment signals "retry" rather than
 * "stop." Cyan accent + RefreshCcw icon match the soft tone.
 */
export function SoftFailedView({
  reason,
  attemptsRemaining,
  onTryAgain,
  onCancel,
}: {
  reason: string;
  attemptsRemaining: number;
  onTryAgain: () => void;
  onCancel: () => void;
}) {
  const hint = SOFT_HINT[reason] ?? SOFT_HINT_FALLBACK;
  const attemptsLabel =
    attemptsRemaining === 1 ? "1 attempt left" : `${attemptsRemaining} attempts left`;

  return (
    <div className="text-center space-y-6">
      <RefreshCcw className="mx-auto h-12 w-12 text-cyan" strokeWidth={1.5} />
      <div>
        <p className="font-sans text-xl font-semibold text-foreground">
          Let&apos;s try that again
        </p>
        <p className="mt-1 text-sm text-muted">{hint}</p>
        <p className="mt-2 text-xs text-muted">{attemptsLabel}</p>
      </div>
      <div className="flex flex-col-reverse gap-2 items-center sm:flex-row sm:justify-center">
        <button
          onClick={onCancel}
          className="rounded-full border border-border px-6 py-2 text-sm text-muted hover:text-foreground hover:border-border-hover transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onTryAgain}
          className="rounded-full border border-cyan/30 bg-cyan/10 px-6 py-2 text-sm font-medium text-cyan hover:bg-cyan/20 transition-colors"
        >
          Try again
        </button>
      </div>
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
 * "baseline is missing"—guarded by a reset.test.ts assertion in the SDK
 * to prevent silent copy drift.
 */
function isMissingBaselineError(error: string): boolean {
  return error.includes("baseline is missing");
}

// Wallet has zero (or insufficient) SOL. Phantom/Solflare/Backpack all
// surface variants of the runtime simulation error verbatim. Match the
// stable substrings the runtime uses, not the wrapper text.
function isInsufficientSolError(error: string): boolean {
  const e = error.toLowerCase();
  return (
    e.includes("prior credit") ||
    e.includes("insufficient funds") ||
    e.includes("insufficient lamports")
  );
}

// User dismissed or rejected the wallet's signature prompt. Wallet
// adapters use slightly different wording—match the common ones.
function isUserRejectionError(error: string): boolean {
  const e = error.toLowerCase();
  return (
    e.includes("user rejected") ||
    e.includes("rejected the request") ||
    e.includes("user denied") ||
    e.includes("rejected by user")
  );
}

// Transaction's recent blockhash expired before landing on chain.
// Recoverable by retrying—the SDK requests a fresh blockhash on each
// attempt.
function isStaleBlockhashError(error: string): boolean {
  return (
    error.includes("Blockhash not found") ||
    error.includes("block height exceeded") ||
    error.includes("TransactionExpiredBlockheightExceeded")
  );
}

// Per-wallet attempt cap (master-list #94 C4) exceeded on the executor.
// Server returns a 429 with `{reason: "rate_limited"}` and a friendly
// `error` body string. Surfacing a distinct title prevents the
// "Verification failed" generic page when the user is just being told
// to wait.
function isRateLimitedError(error: string): boolean {
  return error.toLowerCase().includes("too many attempts");
}

type FailureKind =
  | { kind: "relayer-down" }
  | { kind: "missing-baseline"; canReset: boolean }
  | { kind: "insufficient-sol" }
  | { kind: "user-rejection" }
  | { kind: "stale-blockhash" }
  | { kind: "rate-limited" }
  | { kind: "generic"; message: string };

function categorizeFailure(error: string, canResetBaseline: boolean): FailureKind {
  if (isRelayerError(error)) return { kind: "relayer-down" };
  if (isMissingBaselineError(error)) {
    return { kind: "missing-baseline", canReset: canResetBaseline };
  }
  if (isInsufficientSolError(error)) return { kind: "insufficient-sol" };
  if (isUserRejectionError(error)) return { kind: "user-rejection" };
  if (isStaleBlockhashError(error)) return { kind: "stale-blockhash" };
  if (isRateLimitedError(error)) return { kind: "rate-limited" };
  return { kind: "generic", message: error };
}

const FAUCET_URL = "https://faucet.solana.com";

export function FailedView({
  error,
  onReset,
  onResetBaseline,
}: {
  error: string;
  onReset: () => void;
  onResetBaseline?: () => void;
}) {
  const failure = categorizeFailure(error, typeof onResetBaseline === "function");

  let title: string;
  let body: string;
  let footnote: string | null = null;
  let primaryCta: { label: string; href: string } | null = null;
  let secondaryAction: { label: string; onClick: () => void; tone: "danger" } | null = null;
  let dismissLabel = "Try again";

  switch (failure.kind) {
    case "relayer-down":
      title = "Relayer not connected";
      body =
        "The Entros relayer service is not running. Verification requires a live relayer connected to Solana devnet.";
      footnote =
        "This is a devnet demo. End-to-end verification will be available when the relayer is deployed.";
      break;
    case "missing-baseline":
      title = "Baseline missing on this device";
      body =
        "Your Entros Anchor exists on-chain, but the encrypted baseline that proves continuity is not on this device. You can reset your baseline to re-enroll from this device.";
      if (failure.canReset && onResetBaseline) {
        secondaryAction = {
          label: "Reset baseline",
          onClick: onResetBaseline,
          tone: "danger",
        };
        dismissLabel = "Cancel";
      }
      break;
    case "insufficient-sol":
      // MAINNET TODO (master-list #124): rewrite devnet-specific copy + CTA.
      // Mainnet users need SOL from a CEX/DEX, not the faucet—body should
      // drop the "devnet" qualifier and the "Get devnet SOL" button should
      // either disappear or repoint to a "How to get SOL" docs page.
      title = "This wallet needs SOL";
      body =
        "Verifying on devnet requires a small amount of SOL to write the on-chain anchor. Your wallet currently has none.";
      primaryCta = { label: "Get devnet SOL", href: FAUCET_URL };
      footnote = "Once the airdrop confirms in your wallet, click Try again.";
      break;
    case "user-rejection":
      title = "Signature canceled";
      body = "You canceled the signature in your wallet.";
      break;
    case "stale-blockhash":
      title = "Network was slow";
      body =
        "Your transaction expired before reaching Solana. The network was slow—try again.";
      break;
    case "rate-limited":
      title = "Too many attempts";
      body =
        "This wallet has reached its retry limit for the current window. Please wait an hour before trying again.";
      break;
    case "generic":
      title = "Verification failed";
      body = failure.message;
      break;
  }

  return (
    <div className="text-center space-y-6">
      <AlertCircle className="mx-auto h-12 w-12 text-danger" />
      <div>
        <p className="font-sans text-xl font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted">{body}</p>
        {footnote && <p className="mt-2 text-xs text-muted">{footnote}</p>}
      </div>
      {primaryCta && (
        <a
          href={primaryCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-6 py-2 text-sm font-medium text-cyan hover:bg-cyan/20 transition-colors"
        >
          {primaryCta.label}
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      )}
      <div className="flex flex-col-reverse gap-2 items-center sm:flex-row sm:justify-center">
        <button
          onClick={onReset}
          className="rounded-full border border-border px-6 py-2 text-sm text-muted hover:text-foreground hover:border-border-hover transition-colors"
        >
          {dismissLabel}
        </button>
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="rounded-full border border-danger/30 bg-danger/10 px-6 py-2 text-sm font-medium text-danger hover:bg-danger/20 transition-colors"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
