"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { type IdentityState, PROGRAM_IDS } from "@iam-protocol/pulse-sdk";
import { PublicKey } from "@solana/web3.js";
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
  const { publicKey, connected, disconnect } = useWallet();
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

    // Direct account read with manual deserialization (avoids IDL fetch issues)
    const programId = new PublicKey(PROGRAM_IDS.iamAnchor);
    const [identityPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode("identity"), publicKey.toBuffer()],
      programId
    );

    connection.getAccountInfo(identityPda)
      .then((account: { data: Uint8Array } | null) => {
        if (!account || account.data.length < 62) {
          setIdentity(null);
          return;
        }
        const data = account.data;
        const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

        // IdentityState layout: 8 disc + 32 owner + 8 creation + 8 lastVerif + 4 count + 2 trust + 32 commitment + 32 mint
        const creationTimestamp = Number(view.getBigInt64(40, true));
        const lastVerificationTimestamp = Number(view.getBigInt64(48, true));
        const verificationCount = view.getUint32(56, true);
        const trustScore = view.getUint16(60, true);
        const currentCommitment = new Uint8Array(data.slice(62, 94));
        const mintBytes = data.slice(94, 126);
        const mintPubkey = new PublicKey(mintBytes);

        setIdentity({
          owner: publicKey.toBase58(),
          creationTimestamp,
          lastVerificationTimestamp,
          verificationCount,
          trustScore,
          currentCommitment,
          mint: mintPubkey.toBase58(),
        });
      })
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
            View your IAM Anchor, Trust Score,
            <br className="md:hidden" />
            {" "}and verification history.
          </p>
        </div>
        <WalletConnectButton />
      </div>
    );
  }

  const truncatedAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  const walletBadge = (
    <div className="flex justify-center mb-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-1.5">
        <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
        <span className="font-mono text-xs text-cyan">{truncatedAddress}</span>
        <button
          onClick={() => disconnect()}
          className="ml-1 text-xs text-foreground/40 hover:text-foreground transition-colors"
          aria-label="Disconnect wallet"
        >
          &times;
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="py-16">
        {walletBadge}
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-cyan animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md text-center space-y-4 py-12">
        {walletBadge}
        <ShieldAlert className="mx-auto h-10 w-10 text-danger" strokeWidth={1.5} />
        <p className="text-sm text-muted">{error}</p>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="mx-auto max-w-md text-center space-y-6 py-12">
        {walletBadge}
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
    <div>
      {walletBadge}
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
          {identity.trustScore > 0 ? (
            <p className="mt-2 text-xs text-muted">Active</p>
          ) : (
            <div className="mt-3 text-xs text-muted max-w-[200px]">
              <p className="text-cyan font-mono">Baseline established</p>
              <p className="mt-1">Re-verify to start building your Trust Score. Each session that matches your behavioral pattern increases it.</p>
            </div>
          )}
        </div>
      </GlowCard>

      <GlowCard className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted">
              Verifications
            </p>
            <p className="mt-1 text-2xl font-mono font-bold text-foreground">
              {identity.verificationCount + 1}
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
    </div>
  );
}
