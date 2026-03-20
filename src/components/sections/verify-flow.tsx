"use client";

import { useReducer, useState } from "react";
import type { VerifyMode } from "@/components/verify/types";
import {
  verifyReducer,
  initialState,
} from "@/components/verify/verify-state-machine";
import { GlassPanel } from "@/components/ui/glass-panel";
import { VerifyModeToggle } from "./verify-mode-toggle";
import { VerifyWalletless } from "./verify-walletless";
import { VerifyWalletConnected } from "./verify-wallet-connected";

export function VerifyFlow() {
  const [mode, setMode] = useState<VerifyMode>("walletless");
  const [state, dispatch] = useReducer(verifyReducer, initialState);

  function handleModeChange(newMode: VerifyMode) {
    if (state.step !== "idle") {
      dispatch({ type: "RESET" });
    }
    setMode(newMode);
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        <VerifyModeToggle mode={mode} onChange={handleModeChange} />
      </div>

      <GlassPanel className="mx-auto max-w-xl rounded-2xl px-8 py-8">
        {mode === "walletless" ? (
          <VerifyWalletless state={state} dispatch={dispatch} />
        ) : (
          <VerifyWalletConnected state={state} dispatch={dispatch} />
        )}
      </GlassPanel>
    </div>
  );
}
