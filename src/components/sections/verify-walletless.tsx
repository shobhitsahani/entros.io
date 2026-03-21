"use client";

import { useRef, useState } from "react";
import type { PulseSession } from "@iam-protocol/pulse-sdk";
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
  const sessionRef = useRef<PulseSession | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  function handleStart() {
    const session = pulse.createSession(touchRef.current ?? undefined);
    sessionRef.current = session;
    dispatch({ type: "START_AUDIO" });
    session.startAudio((rms) => setAudioLevel(rms)).catch(() => session.skipAudio());
  }

  async function handleNext() {
    const session = sessionRef.current;
    if (!session || state.step !== "capturing") return;

    if (state.stage === "audio") {
      await session.stopAudio();
      dispatch({ type: "NEXT_STAGE" });
      session.startMotion().catch(() => session.skipMotion());
    } else if (state.stage === "motion") {
      await session.stopMotion();
      dispatch({ type: "NEXT_STAGE" });
      session.startTouch().catch(() => session.skipTouch());
    } else if (state.stage === "touch") {
      await session.stopTouch();
      dispatch({ type: "CAPTURE_DONE" });
      session
        .complete()
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

  if (state.step === "idle") {
    return (
      <div className="text-center space-y-6">
        <Radio className="mx-auto h-10 w-10 text-muted" strokeWidth={1.5} />
        <p className="text-foreground/70 max-w-md mx-auto">
          No wallet needed. Complete a three-stage challenge and the proof is
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

  if (state.step === "capturing") {
    return (
      <PulseChallenge
        stage={state.stage}
        onNext={handleNext}
        touchRef={touchRef}
        audioLevel={audioLevel}
      />
    );
  }

  if (state.step === "processing") return <ProvingView />;

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
