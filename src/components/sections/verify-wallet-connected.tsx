"use client";

import { useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import type { VerifyState, VerifyAction } from "@/components/verify/types";
import { PulseChallenge } from "@/components/verify/pulse-challenge";
import {
  ProvingView,
  SigningView,
  VerifiedView,
  FailedView,
} from "@/components/verify/step-views";
import { WalletConnectButton } from "@/components/ui/wallet-connect-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { usePulse } from "@/components/providers/pulse-provider";
import { Wallet } from "lucide-react";

function commitmentToHex(bytes: Uint8Array): string {
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function VerifyWalletConnected({
  state,
  dispatch,
}: {
  state: VerifyState;
  dispatch: React.ActionDispatch<[action: VerifyAction]>;
}) {
  const { connected, wallet } = useWallet();
  const { connection } = useConnection();
  const pulse = usePulse();
  const touchRef = useRef<HTMLDivElement>(null);
  const pendingResultRef = useRef<{
    type: "success";
    commitment: string;
    txSignature?: string;
  } | {
    type: "failure";
    error: string;
  } | null>(null);
  const timerDoneRef = useRef(false);
  const sdkDoneRef = useRef(false);

  function maybeDispatchResult() {
    if (!timerDoneRef.current || !sdkDoneRef.current) return;
    const result = pendingResultRef.current;
    if (!result) return;
    if (result.type === "success") {
      dispatch({
        type: "VERIFICATION_SUCCESS",
        commitment: result.commitment,
        txSignature: result.txSignature,
      });
    } else {
      dispatch({
        type: "VERIFICATION_FAILED",
        error: result.error,
      });
    }
  }

  function handleStart() {
    pendingResultRef.current = null;
    timerDoneRef.current = false;
    sdkDoneRef.current = false;
    dispatch({ type: "START_CHALLENGE" });

    pulse
      .verify(touchRef.current ?? undefined, wallet?.adapter, connection)
      .then((result) => {
        sdkDoneRef.current = true;
        if (result.success) {
          pendingResultRef.current = {
            type: "success",
            commitment: commitmentToHex(result.commitment),
            txSignature: result.txSignature,
          };
        } else {
          pendingResultRef.current = {
            type: "failure",
            error: result.error ?? "Verification failed",
          };
        }
        maybeDispatchResult();
      })
      .catch((err: Error) => {
        sdkDoneRef.current = true;
        pendingResultRef.current = {
          type: "failure",
          error: err.message ?? "Unexpected error",
        };
        maybeDispatchResult();
      });
  }

  function handleChallengeComplete() {
    timerDoneRef.current = true;
    if (sdkDoneRef.current) {
      maybeDispatchResult();
    } else {
      // Timer done but SDK still working — show signing state
      dispatch({ type: "CHALLENGE_COMPLETE" });
      setTimeout(() => {
        dispatch({ type: "PROOF_COMPLETE" });
      }, 2000);
    }
  }

  function handleTick(remaining: number) {
    dispatch({ type: "TICK", timeRemaining: remaining });
  }

  function handleReset() {
    pendingResultRef.current = null;
    timerDoneRef.current = false;
    sdkDoneRef.current = false;
    dispatch({ type: "RESET" });
  }

  if (!connected) {
    return (
      <div className="text-center space-y-6">
        <Wallet className="mx-auto h-10 w-10 text-muted" strokeWidth={1.5} />
        <p className="text-foreground/70 max-w-md mx-auto">
          Connect your Solana wallet to verify with full self-custody. You sign
          the verification transaction directly.
        </p>
        <WalletConnectButton className="!rounded-full !border !border-border !bg-surface !text-foreground !font-mono !text-sm" />
      </div>
    );
  }

  if (state.step === "idle") {
    return (
      <div className="text-center space-y-6">
        <Wallet className="mx-auto h-10 w-10 text-muted" strokeWidth={1.5} />
        <p className="text-foreground/70 max-w-md mx-auto">
          Wallet connected. Complete the challenge, then sign the verification
          transaction with your wallet.
        </p>
        <div className="flex justify-center">
          <ShimmerButton className="text-sm font-medium" onClick={handleStart}>
            Start Verification
          </ShimmerButton>
        </div>
      </div>
    );
  }

  if (state.step === "challenge") {
    return (
      <PulseChallenge
        timeRemaining={state.timeRemaining}
        onComplete={handleChallengeComplete}
        onTick={handleTick}
        touchRef={touchRef}
      />
    );
  }

  if (state.step === "proving") return <ProvingView />;
  if (state.step === "signing") return <SigningView />;

  if (state.step === "verified") {
    return (
      <VerifiedView
        commitment={state.commitment}
        txSignature={state.txSignature}
        subtitle="Transaction confirmed on Solana devnet"
        onReset={handleReset}
      />
    );
  }

  if (state.step === "failed") {
    return <FailedView error={state.error} onReset={handleReset} />;
  }

  return null;
}
