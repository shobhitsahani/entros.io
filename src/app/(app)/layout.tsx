"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { PulseProvider } from "@/components/providers/pulse-provider";

function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <PulseProvider>
        <ScrollToTop />
        {children}
      </PulseProvider>
    </WalletProvider>
  );
}
