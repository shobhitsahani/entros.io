"use client";

import { WalletProvider } from "@/components/providers/wallet-provider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletProvider>{children}</WalletProvider>;
}
