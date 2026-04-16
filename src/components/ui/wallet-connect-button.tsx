"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { AlertTriangle } from "lucide-react";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

/**
 * SSR-safe match-media hook. Initializes to `false` on the server and
 * during the first client render to avoid hydration mismatches; resolves
 * to the real value on mount and on subsequent media-query changes.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Mobile-only hint. Mobile browser wallet connection is limited across the
 * Solana ecosystem during devnet (wallets default to mainnet, developer
 * mode is buried, devnet SOL is hard to acquire on mobile). Walletless
 * mode covers the mobile demo path; full mobile wallet support arrives
 * with the Solana Mobile app on Seeker.
 */
function MobileWalletHint() {
  const { connected } = useWallet();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!isMobile || connected) return null;

  return (
    <div className="mt-3 flex max-w-xs items-start gap-2 text-xs text-foreground/60 leading-relaxed">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
      <p className="text-left">
        Mobile wallet connection is limited during devnet. Use Walletless mode,
        or open on desktop for the full wallet flow. Native mobile support
        arrives with the Solana Mobile app.
      </p>
    </div>
  );
}

/**
 * Desktop-only hint. Reminds users this is a devnet pilot and points them
 * to the Solana faucet for free devnet SOL plus the wallet network switch.
 */
function DevnetHint() {
  const { connected } = useWallet();
  const isDesktop = useMediaQuery("(min-width: 769px)");

  if (!isDesktop || connected) return null;

  return (
    <div className="mt-3 flex max-w-xs items-start gap-2 text-xs text-foreground/60 leading-relaxed">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
      <p className="text-left">
        Devnet pilot — switch your wallet to Devnet and grab free SOL from the{" "}
        <a
          href="https://faucet.solana.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan underline hover:text-foreground transition-colors"
        >
          Solana faucet
        </a>
        .
      </p>
    </div>
  );
}

export function WalletConnectButton({ className }: { className?: string }) {
  return (
    <div className="flex flex-col items-center">
      <WalletMultiButton className={className} />
      <MobileWalletHint />
      <DevnetHint />
    </div>
  );
}
