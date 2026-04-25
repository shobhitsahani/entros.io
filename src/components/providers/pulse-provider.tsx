"use client";

import { createContext, useContext, useMemo } from "react";
import { PulseSDK, type PulseConfig } from "@entros/pulse-sdk";

const PulseContext = createContext<PulseSDK | null>(null);

export function PulseProvider({ children }: { children: React.ReactNode }) {
  const sdk = useMemo(() => {
    const config: PulseConfig = {
      cluster:
        (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as PulseConfig["cluster"]) ??
        "devnet",
      rpcEndpoint: process.env.NEXT_PUBLIC_SOLANA_RPC,
      relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL,
      relayerApiKey: process.env.NEXT_PUBLIC_RELAYER_API_KEY,
      wasmUrl: process.env.NEXT_PUBLIC_WASM_URL,
      zkeyUrl: process.env.NEXT_PUBLIC_ZKEY_URL,
      debug: process.env.NODE_ENV === "development",
    };
    return new PulseSDK(config);
  }, []);

  return (
    <PulseContext.Provider value={sdk}>{children}</PulseContext.Provider>
  );
}

export function usePulse(): PulseSDK {
  const ctx = useContext(PulseContext);
  if (!ctx) throw new Error("usePulse must be used within PulseProvider");
  return ctx;
}
