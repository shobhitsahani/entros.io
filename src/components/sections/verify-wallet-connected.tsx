"use client";

import { useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import type { PulseSession } from "@iam-protocol/pulse-sdk";
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
  const sessionRef = useRef<PulseSession | null>(null);

  function handleStart() {
    const session = pulse.createSession(touchRef.current ?? undefined);
    sessionRef.current = session;
    dispatch({ type: "START_AUDIO" });
    session.startAudio().catch(() => session.skipAudio());
  }

  async function handleNext() {
    const session = sessionRef.current;
    if (!session || state.step !== "capturing") return;

    if (state.stage === "audio") {
      try { await session.stopAudio(); } catch { /* skipped */ }
      dispatch({ type: "NEXT_STAGE" });
      session.startMotion().catch(() => session.skipMotion());
    } else if (state.stage === "motion") {
      try { await session.stopMotion(); } catch { /* skipped */ }
      dispatch({ type: "NEXT_STAGE" });
      session.startTouch().catch(() => session.skipTouch());
    } else if (state.stage === "touch") {
      try { await session.stopTouch(); } catch { /* skipped */ }
      dispatch({ type: "CAPTURE_DONE" });

      setTimeout(() => {
        dispatch({ type: "PROOF_COMPLETE" });
      }, 2000);

      session
        .complete(wallet?.adapter, connection)
        .then((result) => {
          if (result.success) {
            dispatch({
              type: "VERIFICATION_SUCCESS",
              commitment: commitmentToHex(result.commitment),
              txSignature: result.txSignature,
            });
          } else {
            dispatch({
              type: "VERIFICATION_FAILED",
              error: result.error ?? "Verification failed",
            });
          }
        })
        .catch((err: Error) => {
          dispatch({
            type: "VERIFICATION_FAILED",
            error: err.message ?? "Unexpected error",
          });
        });
    }
  }

  function handleReset() {
    sessionRef.current = null;
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

  if (state.step === "capturing") {
    return (
      <PulseChallenge
        stage={state.stage}
        onNext={handleNext}
        touchRef={touchRef}
      />
    );
  }

  if (state.step === "processing") return <ProvingView />;
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
