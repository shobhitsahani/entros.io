"use client";

import { useState, useRef } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { GlowCard } from "@/components/ui/glow-card";
import { CheckCircle, XCircle, Loader2, Search, ExternalLink } from "lucide-react";
import { explorerUrl } from "@/lib/explorer";

const DEMO_WALLET = "2jowceXRayDC3ufU3kRjf67zT3cLv48q4gbcdhA1SNQw";
const IAM_ANCHOR_PROGRAM = "GZYwTp2ozeuRA5Gof9vs4ya961aANcJBdUzB7LN6q4b2";

interface IdentityResult {
  trustScore: number;
  verificationCount: number;
  lastVerified: number;
  createdAt: number;
  anchorPda: string;
}

function formatTimestamp(unix: number): string {
  if (unix === 0) return "Never";
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(unix: number): string {
  if (unix === 0) return "";
  const seconds = Math.floor(Date.now() / 1000 - unix);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function IntegratePlayground() {
  const { connection } = useConnection();
  const [wallet, setWallet] = useState("");
  const [result, setResult] = useState<IdentityResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  async function checkWallet(address: string) {
    if (!address.trim()) return;
    const thisRequest = ++requestId.current;
    setLoading(true);
    setError(null);
    setResult(null);
    setNotFound(false);

    try {
      const { PublicKey } = await import("@solana/web3.js");

      let pubkey: InstanceType<typeof PublicKey>;
      try {
        pubkey = new PublicKey(address.trim());
      } catch {
        if (requestId.current === thisRequest) {
          setError("Invalid Solana address.");
          setLoading(false);
        }
        return;
      }

      const programId = new PublicKey(IAM_ANCHOR_PROGRAM);
      const [identityPda] = PublicKey.findProgramAddressSync(
        [new TextEncoder().encode("identity"), pubkey.toBuffer()],
        programId
      );

      const account = await connection.getAccountInfo(identityPda);
      if (requestId.current !== thisRequest) return;

      if (!account || account.data.length < 62) {
        setNotFound(true);
        return;
      }

      const data = account.data;
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

      setResult({
        createdAt: Number(view.getBigInt64(40, true)),
        lastVerified: Number(view.getBigInt64(48, true)),
        verificationCount: view.getUint32(56, true),
        trustScore: view.getUint16(60, true),
        anchorPda: identityPda.toBase58(),
      });
    } catch {
      if (requestId.current === thisRequest) setError("Network error. Check the address and try again.");
    } finally {
      if (requestId.current === thisRequest) setLoading(false);
    }
  }

  return (
    <div>
      <GlowCard>
        <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">
          Live on Solana devnet
        </p>
        <p className="text-sm text-foreground/70 mb-5">
          Paste any wallet address to check its IAM verification status on-chain.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="playground-wallet"
              className="block text-xs font-mono uppercase tracking-widest text-muted mb-2"
            >
              Wallet Address
            </label>
            <input
              id="playground-wallet"
              type="text"
              placeholder="Paste a Solana wallet address..."
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-mono text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-cyan/50 transition-colors"
              value={wallet}
              onChange={(e) => {
                requestId.current++;
                setWallet(e.target.value);
                setResult(null);
                setNotFound(false);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && checkWallet(wallet)}
            />
          </div>
          <button
            onClick={() => checkWallet(wallet)}
            disabled={loading || !wallet.trim()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-mono text-foreground transition-colors hover:border-cyan/50 hover:text-cyan disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Check
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        {notFound && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-surface/30 p-5">
            <XCircle className="h-6 w-6 text-muted shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-foreground">Not verified</p>
              <p className="text-xs text-muted mt-0.5">
                This wallet has no IAM Anchor on devnet. No Trust Score, no verification history.
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-5 rounded-xl border border-solana-green/20 bg-solana-green/5 p-5">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-solana-green shrink-0" />
              <p className="text-sm font-medium text-foreground">Verified Human</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted">Trust Score</p>
                <p className="mt-1 text-2xl font-mono font-bold text-foreground">{result.trustScore}</p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted">Verifications</p>
                <p className="mt-1 text-2xl font-mono font-bold text-foreground">{result.verificationCount}</p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted">Last Verified</p>
                <p className="mt-1 text-sm font-mono text-foreground">{timeAgo(result.lastVerified)}</p>
                <p className="text-xs text-muted">{formatTimestamp(result.lastVerified)}</p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted">Created</p>
                <p className="mt-1 text-sm font-mono text-foreground">{formatTimestamp(result.createdAt)}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50">
              <p className="text-xs font-mono uppercase tracking-widest text-muted">IAM Anchor PDA</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs font-mono text-foreground/60 break-all">{result.anchorPda}</p>
                <a
                  href={explorerUrl(result.anchorPda)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-cyan hover:text-foreground transition-colors"
                  aria-label="View on Solana Explorer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </GlowCard>

      <p className="mt-4 text-xs text-muted text-center">
        Try with:{" "}
        <button
          onClick={() => {
            setWallet(DEMO_WALLET);
            checkWallet(DEMO_WALLET);
          }}
          className="text-cyan hover:text-foreground transition-colors font-mono"
        >
          2jowce...SNQw
        </button>{" "}
        (IAM verified wallet on devnet)
      </p>
    </div>
  );
}
