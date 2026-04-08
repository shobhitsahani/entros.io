"use client";

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

          // If no connection prop is passed, use a default devnet connection
          const conn = connection || new Connection("https://api.devnet.solana.com", "confirmed");
          
          const account = await conn.getAccountInfo(identityPda);
          
          if (isMounted) {
            if (!account || account.data.length < EXPECTED_SIZE) {
              setTrustScore(null);
            } else {
              const data = account.data;
              const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
              // Trust score is a u16 at offset 60
              const score = view.getUint16(60, true);
              setTrustScore(score);
            }
          }
        } catch (err) {
          if (isMounted) {
            setTrustScore(null);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
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
}
