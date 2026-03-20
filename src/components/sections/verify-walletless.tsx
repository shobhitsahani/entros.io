"use client";

import { useRef } from "react";
import type { VerifyState, VerifyAction } from "@/components/verify/types";
import { PulseChallenge } from "@/components/verify/pulse-challenge";
import { ProvingView, VerifiedView, FailedView } from "@/components/verify/step-views";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { usePulse } from "@/components/providers/pulse-provider";
import { Radio } from "lucide-react";

function commitmentToHex(bytes: Uint8Array): string {
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function VerifyWalletless({
  state,
  dispatch,
}: {
  state: VerifyState;
  dispatch: React.ActionDispatch<[action: VerifyAction]>;
}) {
  const pulse = usePulse();
  const touchRef = useRef<HTMLDivElement>(null);
  // Holds the SDK result until the visual timer finishes
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
      .verify(touchRef.current ?? undefined)
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
    // If SDK already finished, dispatch immediately; otherwise show proving
    if (sdkDoneRef.current) {
      maybeDispatchResult();
    } else {
      dispatch({ type: "CHALLENGE_COMPLETE" });
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

  if (state.step === "idle") {
    return (
      <div className="text-center space-y-6">
        <Radio className="mx-auto h-10 w-10 text-muted" strokeWidth={1.5} />
        <p className="text-foreground/70 max-w-md mx-auto">
          No wallet needed. Complete a 21-second challenge and the proof is
          submitted via the IAM relayer.
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

  if (state.step === "verified") {
    return (
      <VerifiedView
        commitment={state.commitment}
        subtitle="Proof submitted via IAM relayer"
        onReset={handleReset}
      />
    );
  }

  if (state.step === "failed") {
    return <FailedView error={state.error} onReset={handleReset} />;
  }

  return null;
}
