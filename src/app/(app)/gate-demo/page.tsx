"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { EntrosGate } from "@/components/ui/entros-gate";
import { GlowCard } from "@/components/ui/glow-card";
import { CodeBlock } from "@/components/ui/code-block";
import { WalletConnectButton } from "@/components/ui/wallet-connect-button";
import { CheckCircle } from "lucide-react";

const USAGE_CODE = `import { EntrosGate } from "@/components/ui/entros-gate";

export function PremiumPage() {
  return (
    <EntrosGate minTrustScore={100}>
      {/* Children render only when the connected wallet
          has an Entros Anchor with trust score >= 100 */}
      <h1>Welcome, verified human.</h1>
    </EntrosGate>
  );
}`;

const COMPONENT_CODE = `"use client";

/**
 * <EntrosGate> — drop-in route guard for Entros Trust Score.
 *
 * Renders children only when the connected wallet has an Entros Anchor with
 * trustScore >= minTrustScore. Otherwise renders a fallback (default: a
 * verification prompt linking to /verify, or a custom node via the
 * \`fallback\` prop).
 *
 * This component has zero internal UI dependencies. It uses only:
 *   - React + Next.js Link
 *   - @solana/web3.js (PublicKey, Connection)
 *   - @solana/wallet-adapter-react (useWallet, useConnection)
 *   - @solana/wallet-adapter-react-ui (WalletMultiButton — the universal Solana wallet UI)
 *   - @entros/pulse-sdk (PROGRAM_IDS constant)
 *   - lucide-react (icons)
 *   - Tailwind CSS for styling (no custom design system imports)
 *
 * Drop into any Next.js + Tailwind project with Solana wallet adapter set up.
 *
 * Example:
 *   <EntrosGate minTrustScore={100}>
 *     <PremiumContent />
 *   </EntrosGate>
 *
 * SECURITY: This is a client-side gate. It is suitable for UI gating, paywalls
 * with low stakes, and progressive disclosure. For high-stakes access control
 * (spending funds, sensitive data), also validate Trust Score server-side
 * since a determined user can bypass any client-side check via DevTools.
 */

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Connection, PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PROGRAM_IDS } from "@entros/pulse-sdk";
import { Loader2, ShieldAlert, Wallet } from "lucide-react";

const EXPECTED_SIZE = 62;
const ENTROS_PROGRAM_ID = new PublicKey(PROGRAM_IDS.entrosAnchor);

interface EntrosGateProps {
  minTrustScore: number;
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  verifyHref?: string;
}

type FetchState =
  | { status: "loading" }
  | { status: "disconnected" }
  | { status: "no-identity" }
  | { status: "ready"; trustScore: number };

export function EntrosGate({
  minTrustScore,
  children,
  fallback,
  loadingFallback,
  verifyHref = "/verify",
}: EntrosGateProps) {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [fetchState, setFetchState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    if (!connected || !publicKey) {
      setFetchState({ status: "disconnected" });
      return;
    }

    setFetchState({ status: "loading" });
    let isMounted = true;

    const timeoutId = setTimeout(() => {
      (async () => {
        try {
          const [identityPda] = PublicKey.findProgramAddressSync(
            [new TextEncoder().encode("identity"), publicKey.toBuffer()],
            ENTROS_PROGRAM_ID,
          );
          const conn = connection ?? new Connection("https://api.devnet.solana.com", "confirmed");
          const account = await conn.getAccountInfo(identityPda);
          if (!isMounted) return;

          if (!account || account.data.length < EXPECTED_SIZE) {
            setFetchState({ status: "no-identity" });
            return;
          }

          const view = new DataView(
            account.data.buffer,
            account.data.byteOffset,
            account.data.byteLength,
          );
          setFetchState({ status: "ready", trustScore: view.getUint16(60, true) });
        } catch {
          if (isMounted) setFetchState({ status: "no-identity" });
        }
      })();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [publicKey, connected, connection]);

  // Threshold comparison happens at render time, not in the fetch effect.
  // Changing minTrustScore re-renders without triggering a new RPC call.
  if (fetchState.status === "ready" && fetchState.trustScore >= minTrustScore) {
    return <>{children}</>;
  }

  if (fetchState.status === "loading") {
    if (loadingFallback) return <>{loadingFallback}</>;
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (fallback) return <>{fallback}</>;

  const fallbackState =
    fetchState.status === "ready"
      ? ({ status: "below-threshold", trustScore: fetchState.trustScore } as const)
      : fetchState;

  return (
    <DefaultFallback
      state={fallbackState}
      minTrustScore={minTrustScore}
      verifyHref={verifyHref}
    />
  );
}

type FallbackState =
  | { status: "disconnected" }
  | { status: "no-identity" }
  | { status: "below-threshold"; trustScore: number };

function DefaultFallback({
  state,
  minTrustScore,
  verifyHref,
}: {
  state: FallbackState;
  minTrustScore: number;
  verifyHref: string;
}) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
      <div className="flex flex-col items-center text-center gap-4 py-4">
        {state.status === "disconnected" ? (
          <Wallet className="h-12 w-12 text-zinc-400" strokeWidth={1.5} />
        ) : (
          <ShieldAlert className="h-12 w-12 text-zinc-400" strokeWidth={1.5} />
        )}

        {state.status === "disconnected" && (
          <>
            <div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Connect your wallet
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                This content requires a verified Entros identity.
              </p>
            </div>
            <WalletMultiButton />
          </>
        )}

        {state.status === "no-identity" && (
          <>
            <div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Verify your humanness
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                This content requires an Entros Anchor with Trust Score{" "}
                <span className="font-mono text-zinc-900 dark:text-zinc-100">{minTrustScore}</span>{" "}
                or higher.
              </p>
            </div>
            <Link
              href={verifyHref}
              className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 transition-colors"
            >
              Verify now
            </Link>
          </>
        )}

        {state.status === "below-threshold" && (
          <>
            <div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Trust Score too low
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Your Trust Score is{" "}
                <span className="font-mono text-zinc-900 dark:text-zinc-100">
                  {state.trustScore}
                </span>
                . This content requires{" "}
                <span className="font-mono text-zinc-900 dark:text-zinc-100">{minTrustScore}</span>
                . Re-verify across multiple days to grow your score.
              </p>
            </div>
            <Link
              href={verifyHref}
              className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 transition-colors"
            >
              Re-verify
            </Link>
          </>
        )}
      </div>
    </div>
  );
}`;

export default function GateDemo() {
  const [thresholdInput, setThresholdInput] = useState("100");
  const [copied, setCopied] = useState(false);
  const { publicKey, connected, disconnect } = useWallet();

  // Allow the input to be empty while typing, but clamp the value passed to the gate.
  const threshold = Math.min(10000, Math.max(0, parseInt(thresholdInput, 10) || 0));

  const truncatedAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  function copySource() {
    navigator.clipboard.writeText(COMPONENT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <SubpageHero
        title="Entros Gate"
        subtitle={
          "A drop-in React component to gate content by Trust Score.\n" +
          "Wraps any children, renders only when the connected wallet meets your threshold."
        }
      />
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-8 flex justify-center">
          {connected ? (
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
          ) : (
            <WalletConnectButton />
          )}
        </div>

        <GlowCard className="mb-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="w-full space-y-4 md:w-1/2">
              <label
                htmlFor="threshold-input"
                className="block text-sm font-mono text-muted uppercase tracking-widest"
              >
                Required Trust Score
              </label>
              <input
                id="threshold-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:border-cyan/50 transition-colors"
                value={thresholdInput}
                onChange={(e) => setThresholdInput(e.target.value.replace(/[^0-9]/g, ""))}
              />
              <p className="text-xs text-muted">
                Adjust the threshold to test the gate against your connected wallet&apos;s Trust Score.
                Try 0 to allow any verified human, or a high number to block.
              </p>
            </div>

            <div className="w-full md:w-1/2">
              <p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">
                Live preview
              </p>
              <EntrosGate minTrustScore={threshold}>
                <div className="rounded-xl border border-solana-green/30 bg-solana-green/5 p-6 text-center">
                  <CheckCircle className="mx-auto h-8 w-8 text-solana-green mb-3" />
                  <p className="font-sans text-lg font-semibold text-foreground">
                    Protected content visible
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Your Trust Score meets the threshold of {threshold}.
                  </p>
                </div>
              </EntrosGate>
            </div>
          </div>
        </GlowCard>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-mono font-bold text-foreground mb-4">1. Usage</h2>
            <p className="text-sm text-foreground/70 leading-relaxed mb-4">
              Wrap any component tree. The gate handles wallet connection state, identity lookup,
              and Trust Score comparison. A default fallback prompts the user to connect, verify,
              or improve their score.
            </p>
            <CodeBlock code={USAGE_CODE} />
          </section>

          <section>
            <h2 className="text-lg font-mono font-bold text-foreground mb-4">
              2. Component Source
            </h2>
            <p className="text-sm text-foreground/70 leading-relaxed mb-4">
              Copy this code into your project at{" "}
              <code className="text-cyan bg-surface px-1.5 py-0.5 rounded">
                components/ui/entros-gate.tsx
              </code>
              . It requires{" "}
              <code className="text-cyan bg-surface px-1.5 py-0.5 rounded">
                @entros/pulse-sdk
              </code>
              ,{" "}
              <code className="text-cyan bg-surface px-1.5 py-0.5 rounded">
                @solana/web3.js
              </code>
              , and{" "}
              <code className="text-cyan bg-surface px-1.5 py-0.5 rounded">
                @solana/wallet-adapter-react
              </code>
              .
            </p>
            <div className="relative">
              <div className="absolute right-4 top-4 z-10">
                <button
                  onClick={copySource}
                  className="text-xs font-mono text-muted hover:text-cyan transition-colors"
                >
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>
              <CodeBlock code={COMPONENT_CODE} className="max-h-[600px] overflow-y-auto" />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-mono font-bold text-foreground mb-4">3. Custom Fallback</h2>
            <p className="text-sm text-foreground/70 leading-relaxed mb-4">
              Pass a <code className="text-cyan bg-surface px-1.5 py-0.5 rounded">fallback</code>{" "}
              prop to override the default verification prompt entirely.
            </p>
            <CodeBlock
              code={`<EntrosGate
  minTrustScore={100}
  fallback={<YourCustomPrompt />}
>
  <PremiumContent />
</EntrosGate>`}
            />
          </section>
        </div>
      </div>
    </>
  );
}
