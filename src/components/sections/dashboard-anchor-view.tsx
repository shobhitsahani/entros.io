"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { fetchIdentityState, type IdentityState } from "@iam-protocol/pulse-sdk";
import { WalletConnectButton } from "@/components/ui/wallet-connect-button";
import { GlowCard } from "@/components/ui/glow-card";
import { commitmentBytesToHex } from "@/lib/on-chain";
import { ArrowRight, Wallet, Loader2, ShieldAlert } from "lucide-react";

function formatRelativeTime(unixSeconds: number): string {
  const diff = Date.now() - unixSeconds * 1000;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardAnchorView() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [identity, setIdentity] = useState<IdentityState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey || !connected) {
      setIdentity(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetchIdentityState(publicKey.toBase58(), connection)
      .then((state) => setIdentity(state))
      .catch(() => setError("Failed to fetch identity state"))
      .finally(() => setLoading(false));
  }, [publicKey, connected, connection]);

  if (!connected) {
    return (
      <div className="mx-auto max-w-md text-center space-y-6 py-12">
        <Wallet className="mx-auto h-12 w-12 text-muted" strokeWidth={1.5} />
        <div>
          <p className="font-sans text-xl font-semibold text-foreground">
            Connect your wallet
          </p>
          <p className="mt-2 text-sm text-muted">
            View your IAM Anchor, Trust Score, and verification history.
          </p>
        </div>
        <WalletConnectButton className="!rounded-full !border !border-border !bg-surface !text-foreground !font-mono !text-sm" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 text-cyan animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md text-center space-y-4 py-12">
        <ShieldAlert className="mx-auto h-10 w-10 text-danger" strokeWidth={1.5} />
        <p className="text-sm text-muted">{error}</p>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="mx-auto max-w-md text-center space-y-6 py-12">
        <ShieldAlert className="mx-auto h-12 w-12 text-muted" strokeWidth={1.5} />
        <div>
          <p className="font-sans text-xl font-semibold text-foreground">
            No IAM Anchor found
          </p>
          <p className="mt-2 text-sm text-muted">
            Complete your first verification to mint your IAM Anchor identity.
          </p>
        </div>
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 text-sm text-cyan hover:text-foreground transition-colors"
        >
          Verify now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlowCard className="lg:col-span-1">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-muted">
            Trust Score
          </p>
          <p className="mt-3 text-6xl font-mono font-bold text-foreground">
            {identity.trustScore}
          </p>
          <div className="mt-4 h-2 w-full max-w-[200px] rounded-full bg-surface overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan"
              style={{ width: `${Math.min(identity.trustScore, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {identity.trustScore > 0 ? "Active" : "Pending"}
          </p>
        </div>
      </GlowCard>

      <GlowCard className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted">
              Verifications
            </p>
            <p className="mt-1 text-2xl font-mono font-bold text-foreground">
              {identity.verificationCount}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted">
              Last verified
            </p>
            <p className="mt-1 text-2xl font-mono font-bold text-foreground">
              {identity.lastVerificationTimestamp > 0
                ? formatRelativeTime(identity.lastVerificationTimestamp)
                : "Never"}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted">
              Anchor created
            </p>
            <p className="mt-1 text-sm text-foreground/70">
              {formatDate(identity.creationTimestamp)}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted">
              Commitment
            </p>
            <p className="mt-1 text-sm font-mono text-foreground/70 truncate">
              {commitmentBytesToHex(identity.currentCommitment)}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 text-sm text-cyan hover:text-foreground transition-colors"
          >
            Re-verify
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </GlowCard>
    </div>
  );
}
