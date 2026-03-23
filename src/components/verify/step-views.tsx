"use client";

import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function ProvingView() {
  return (
    <div className="text-center space-y-4">
      <Loader2 className="mx-auto h-8 w-8 text-cyan animate-spin" />
      <p className="font-mono text-sm text-foreground">
        Generating Groth16 proof...
      </p>
      <p className="text-xs text-muted">
        Hashing features, computing Poseidon commitment, building ZK proof
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
}: {
  commitment: string;
  txSignature?: string;
  subtitle: string;
  onReset: () => void;
}) {
  return (
    <div className="text-center space-y-6">
      <CheckCircle className="mx-auto h-12 w-12 text-solana-green" />
      <div>
        <p className="font-sans text-xl font-semibold text-foreground">
          Verified
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
        Verify again
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

export function FailedView({
  error,
  onReset,
}: {
  error: string;
  onReset: () => void;
}) {
  const relayerDown = isRelayerError(error);

  return (
    <div className="text-center space-y-6">
      <AlertCircle className="mx-auto h-12 w-12 text-danger" />
      <div>
        <p className="font-sans text-xl font-semibold text-foreground">
          {relayerDown ? "Relayer not connected" : "Verification failed"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {relayerDown
            ? "The IAM relayer service is not running. Verification requires a live relayer connected to Solana devnet."
            : error}
        </p>
        {relayerDown && (
          <p className="mt-2 text-xs text-muted">
            This is a devnet demo. End-to-end verification will be available when the relayer is deployed.
          </p>
        )}
      </div>
      <button
        onClick={onReset}
        className="rounded-full border border-border px-6 py-2 text-sm text-muted hover:text-foreground hover:border-border-hover transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
