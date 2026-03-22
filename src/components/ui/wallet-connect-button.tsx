"use client";

import dynamic from "next/dynamic";

function WalletButtonPlaceholder() {
  return (
    <button
      className="rounded-full border border-border bg-surface text-foreground font-mono text-sm px-4 py-2 opacity-70 cursor-default"
      disabled
    >
      Select Wallet
    </button>
  );
}

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false, loading: () => <WalletButtonPlaceholder /> }
);

export function WalletConnectButton({ className }: { className?: string }) {
  return <WalletMultiButton className={className} />;
}
