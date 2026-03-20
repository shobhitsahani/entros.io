"use client";

import type { VerifyState, VerifyAction } from "@/components/verify/types";
import { PulseChallenge } from "@/components/verify/pulse-challenge";
import { ProvingView, VerifiedView, FailedView } from "@/components/verify/step-views";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { generateMockCommitment } from "@/components/verify/mock-utils";
import { Radio } from "lucide-react";

export function VerifyWalletless({
  state,
  dispatch,
}: {
  state: VerifyState;
  dispatch: React.ActionDispatch<[action: VerifyAction]>;
}) {
  function handleStart() {
    dispatch({ type: "START_CHALLENGE" });
  }

  function handleChallengeComplete() {
    dispatch({ type: "CHALLENGE_COMPLETE" });
    setTimeout(() => {
      dispatch({
        type: "VERIFICATION_SUCCESS",
        commitment: generateMockCommitment(),
      });
    }, 1500);
  }

  function handleTick(remaining: number) {
    dispatch({ type: "TICK", timeRemaining: remaining });
  }

  function handleReset() {
    dispatch({ type: "RESET" });
  }

  if (state.step === "idle") {
    return (
      <div className="text-center space-y-6">
        <Radio className="mx-auto h-10 w-10 text-muted" strokeWidth={1.5} />
        <p className="text-foreground/70 max-w-md mx-auto">
          No wallet needed. Complete a 7-second challenge and the proof is
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
