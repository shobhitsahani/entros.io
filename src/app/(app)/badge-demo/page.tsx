"use client";

import { useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { IAMBadge } from "@/components/ui/iam-badge";
import { GlowCard } from "@/components/ui/glow-card";
import { CodeBlock } from "@/components/ui/code-block";

const COMPONENT_CODE = `"use client";

import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { PROGRAM_IDS } from "@iam-protocol/pulse-sdk";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EXPECTED_SIZE = 62;
const IAM_PROGRAM_ID = new PublicKey(PROGRAM_IDS.iamAnchor);

interface IAMBadgeProps {
  walletAddress: string;
  connection?: Connection;
  className?: string;
}

export function IAMBadge({ walletAddress, connection, className }: IAMBadgeProps) {
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      setTrustScore(null);
      setInvalid(false);
      setLoading(false);
      return;
    }

    let pubkey: PublicKey;
    try {
      pubkey = new PublicKey(walletAddress);
      setInvalid(false);
    } catch (err) {
      setInvalid(true);
      setTrustScore(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    let isMounted = true;

    const timeoutId = setTimeout(() => {
      const fetchIdentity = async () => {
        try {
          const [identityPda] = PublicKey.findProgramAddressSync(
            [new TextEncoder().encode("identity"), pubkey.toBuffer()],
            IAM_PROGRAM_ID
          );

          const conn = connection || new Connection("https://api.devnet.solana.com", "confirmed");
          const account = await conn.getAccountInfo(identityPda);
          
          if (isMounted) {
            if (!account || account.data.length < EXPECTED_SIZE) {
              setTrustScore(null);
            } else {
              const data = account.data;
              const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
              const score = view.getUint16(60, true);
              setTrustScore(score);
            }
          }
        } catch (err) {
          if (isMounted) setTrustScore(null);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      fetchIdentity();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [walletAddress, connection]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
        invalid
          ? "border-danger/30 bg-danger/10 text-danger"
          : loading 
            ? "border-border bg-surface/30 text-muted"
            : trustScore !== null
              ? "border-solana-green/30 bg-solana-green/10 text-solana-green"
              : "border-border bg-surface/30 text-muted",
        className
      )}
    >
      {invalid ? (
        <>
          <span className="h-2 w-2 rounded-full bg-danger/50" />
          <span>Invalid Address</span>
        </>
      ) : loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />
          <span>Verifying IAM...</span>
        </>
      ) : trustScore !== null ? (
        <>
          <span className="h-2 w-2 rounded-full bg-solana-green animate-pulse" />
          <span>
            Verified <span className="text-solana-green/50">·</span> Trust:{" "}
            <span className="font-bold">{trustScore}</span>
          </span>
        </>
      ) : (
        <>
          <span className="h-2 w-2 rounded-full bg-muted" />
          <span>Not Verified</span>
        </>
      )}
    </div>
  );
}`;

const USAGE_CODE = `import { IAMBadge } from "@/components/ui/iam-badge";
import { useConnection } from "@solana/wallet-adapter-react";

export function ProfileHeader({ walletAddress }) {
  const { connection } = useConnection();

  return (
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-bold">{walletAddress}</h2>
      <IAMBadge walletAddress={walletAddress} connection={connection} />
    </div>
  );
}`;

export default function BadgeDemo() {
  const { connection } = useConnection();
  const [walletInput, setWalletInput] = useState("");
  // Only pass down a valid length string to avoid quick re-renders on typing
  // base58 solana addresses are usually 32-44 characters
  const isValidLength = walletInput.length >= 32;

  return (
    <>
      <SubpageHero
        title="IAM Badge"
        subtitle="A drop-in React component to display on-chain proof-of-humanity status."
      />
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <GlowCard className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/2 space-y-4">
              <label htmlFor="wallet-input" className="block text-sm font-mono text-muted uppercase tracking-widest">
                Test Wallet Address
              </label>
              <input
                id="wallet-input"
                type="text"
                placeholder="Enter a Solana address..."
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:border-cyan/50 transition-colors"
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
              />
              <p className="text-xs text-muted">
                Tip: Use a wallet from your devnet testing to see the verified state.
              </p>
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center min-h-[100px] border border-dashed border-border/50 rounded-xl bg-surface/20 p-8">
              <p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">
                Preview
              </p>
              <div className="h-10 flex items-center justify-center">
                {isValidLength ? (
                  <IAMBadge walletAddress={walletInput} connection={connection} />
                ) : (
                  <span className="text-sm font-mono text-muted/50">
                    Enter a valid address to preview
                  </span>
                )}
              </div>
            </div>
          </div>
        </GlowCard>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-mono font-bold text-foreground mb-4">1. Usage</h2>
            <p className="text-sm text-foreground/70 leading-relaxed mb-4">
              Import and use the component anywhere in your app. Pass the wallet address and ideally your active Solana connection.
            </p>
            <CodeBlock code={USAGE_CODE} />
          </section>

          <section>
            <h2 className="text-lg font-mono font-bold text-foreground mb-4">2. Component Source</h2>
            <p className="text-sm text-foreground/70 leading-relaxed mb-4">
              Copy this code into your project at <code className="text-cyan bg-surface px-1.5 py-0.5 rounded">components/ui/iam-badge.tsx</code>. It requires the <code className="text-cyan bg-surface px-1.5 py-0.5 rounded">@iam-protocol/pulse-sdk</code> and <code className="text-cyan bg-surface px-1.5 py-0.5 rounded">@solana/web3.js</code> packages.
            </p>
            <div className="relative">
              <div className="absolute right-4 top-4 z-10">
                <button 
                  onClick={() => navigator.clipboard.writeText(COMPONENT_CODE)}
                  className="text-xs font-mono text-muted hover:text-cyan transition-colors"
                >
                  COPY
                </button>
              </div>
              <CodeBlock code={COMPONENT_CODE} className="max-h-[600px] overflow-y-auto" />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
