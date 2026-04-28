"use client";

import { Component, useReducer, useState } from "react";
import type { VerifyMode } from "@/components/verify/types";
import {
  verifyReducer,
  initialState,
} from "@/components/verify/verify-state-machine";
import { VerifyModeToggle } from "./verify-mode-toggle";
import { VerifyWalletless } from "./verify-walletless";
import { VerifyWalletConnected } from "./verify-wallet-connected";

class VerifyErrorBoundary extends Component<
  { children: React.ReactNode; onError: () => void },
  { error: string | null }
> {
  state = { error: null as string | null };

  static getDerivedStateFromError(err: Error) {
    return { error: err.message ?? "An unexpected error occurred" };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="space-y-4 py-8 text-center">
          <p className="text-sm text-danger">Verification error</p>
          <p className="text-xs text-foreground/55">{this.state.error}</p>
          <button
            onClick={() => {
              this.setState({ error: null });
              this.props.onError();
            }}
            className="rounded-full border border-border px-6 py-2 text-sm text-foreground/65 transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function VerifyFlow() {
  const [mode, setMode] = useState<VerifyMode>("wallet-connected");
  const [state, dispatch] = useReducer(verifyReducer, initialState);

  function handleModeChange(newMode: VerifyMode) {
    if (state.step !== "idle") {
      dispatch({ type: "RESET" });
    }
    setMode(newMode);
  }

  function handleBoundaryError() {
    dispatch({ type: "RESET" });
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <VerifyModeToggle mode={mode} onChange={handleModeChange} />
      </div>

      <div className="relative mx-auto flex min-h-[460px] max-w-xl flex-col justify-center border border-border bg-surface px-8 py-10">
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-cyan/70" aria-hidden />
        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-cyan/70" aria-hidden />
        <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-cyan/70" aria-hidden />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-cyan/70" aria-hidden />

        <VerifyErrorBoundary onError={handleBoundaryError}>
          {mode === "walletless" ? (
            <VerifyWalletless state={state} dispatch={dispatch} />
          ) : (
            <VerifyWalletConnected state={state} dispatch={dispatch} />
          )}
        </VerifyErrorBoundary>
      </div>
    </div>
  );
}
