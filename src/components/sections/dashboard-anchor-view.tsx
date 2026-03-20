"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletConnectButton } from "@/components/ui/wallet-connect-button";
import { GlowCard } from "@/components/ui/glow-card";
import { mockAnchor } from "@/data/mock-anchor";
import { ArrowRight, Wallet } from "lucide-react";

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardAnchorView() {
  const { connected } = useWallet();

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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlowCard className="lg:col-span-1">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-muted">
            Trust Score
          </p>
          <p className="mt-3 text-6xl font-mono font-bold text-foreground">
            {mockAnchor.trustScore}
          </p>
          <div className="mt-4 h-2 w-full max-w-[200px] rounded-full bg-surface overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan"
              style={{ width: `${mockAnchor.trustScore}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {mockAnchor.status === "active" ? "Active" : "Expired"}
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
              {mockAnchor.verificationCount}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted">
              Last verified
            </p>
            <p className="mt-1 text-2xl font-mono font-bold text-foreground">
              {formatRelativeTime(mockAnchor.lastVerification)}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted">
              Anchor created
            </p>
            <p className="mt-1 text-sm text-foreground/70">
              {formatDate(mockAnchor.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted">
              Commitment
            </p>
            <p className="mt-1 text-sm font-mono text-foreground/70 truncate">
              {mockAnchor.currentCommitment}
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
