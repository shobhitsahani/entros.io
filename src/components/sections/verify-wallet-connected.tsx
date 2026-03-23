"use client";

import { useEffect, useRef, useState } from "react";
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
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasMotion, setHasMotion] = useState(false);
  const voicedFramesRef = useRef(0);

  useEffect(() => {
    setHasMotion(navigator.maxTouchPoints > 0);
  }, []);

  async function handleStart() {
    voicedFramesRef.current = 0;

    const session = pulse.createSession(touchRef.current ?? document.body);
    sessionRef.current = session;

    // Audio is mandatory — must complete before other permissions
    // to avoid iOS gesture context collision with DeviceMotion permission dialog
    try {
      let audioFrameCount = 0;
      await session.startAudio((rms) => {
        if (rms > 0.015) voicedFramesRef.current++;
        audioFrameCount++;
        if (audioFrameCount % 6 === 0) setAudioLevel(rms);
      });
    } catch {
      dispatch({
        type: "VERIFICATION_FAILED",
        error: "Microphone access denied. Please allow microphone permission and try again.",
      });
      return;
    }

    session.startMotion().catch(() => session.skipMotion());
    session.startTouch().catch(() => session.skipTouch());

    dispatch({ type: "START_CAPTURE" });
  }

  async function handleCaptureComplete() {
    const session = sessionRef.current;
    if (!session) return;

    try { await session.stopAudio(); } catch { /* skipped */ }
    try { await session.stopMotion(); } catch { /* skipped */ }
    try { await session.stopTouch(); } catch { /* skipped */ }

    dispatch({ type: "CAPTURE_DONE" });

    session
      .complete(wallet?.adapter, connection)
      .then((result) => {
        dispatch({ type: "PROOF_COMPLETE" });
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

  function handleReset() {
    sessionRef.current = null;
    setAudioLevel(0);
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
      <div className="space-y-6">
        <div className="text-center">
          <Wallet className="mx-auto h-10 w-10 text-muted mb-4" strokeWidth={1.5} />
          <p className="font-mono text-base font-semibold text-foreground">
            Behavioral Verification
          </p>
          <p className="mt-2 text-sm text-foreground/70 max-w-sm mx-auto">
            Speak a phrase while tracing a shape. All sensors record
            simultaneously for 12 seconds. Then sign with your wallet.
          </p>
        </div>
        <div className={`grid gap-4 mx-auto max-w-sm ${hasMotion ? "grid-cols-3" : "grid-cols-2"}`}>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-cyan font-mono text-xl font-bold">1</span>
            <span className="text-sm text-foreground/70">Speak the displayed phrase</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-solana-green font-mono text-xl font-bold">2</span>
            <span className="text-sm text-foreground/70">Trace the curve on screen</span>
          </div>
          {hasMotion && (
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-solana-purple font-mono text-xl font-bold">3</span>
              <span className="text-sm text-foreground/70">Move naturally throughout</span>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <ShimmerButton className="text-sm font-medium" onClick={handleStart}>
            Start Verification
          </ShimmerButton>
        </div>
        <p className="text-center text-xs text-muted">
          All data stays on your device. Only the ZK proof leaves.
        </p>
      </div>
    );
  }

  if (state.step === "capturing") {
    return (
      <PulseChallenge
        onComplete={handleCaptureComplete}
        touchRef={touchRef}
        audioLevel={audioLevel}
        hasMotion={hasMotion}
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
