"use client";

import { useWallet } from "@solana/wallet-adapter-react";
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
import {
  generateMockCommitment,
  generateMockTxSignature,
} from "@/components/verify/mock-utils";
import { Wallet } from "lucide-react";

export function VerifyWalletConnected({
  state,
  dispatch,
}: {
  state: VerifyState;
  dispatch: React.ActionDispatch<[action: VerifyAction]>;
}) {
  const { connected } = useWallet();

  function handleStart() {
    dispatch({ type: "START_CHALLENGE" });
  }

  function handleChallengeComplete() {
    dispatch({ type: "CHALLENGE_COMPLETE" });
    setTimeout(() => {
      dispatch({ type: "PROOF_COMPLETE" });
      setTimeout(() => {
        dispatch({
          type: "VERIFICATION_SUCCESS",
          commitment: generateMockCommitment(),
          txSignature: generateMockTxSignature(),
        });
      }, 1000);
    }, 1500);
  }

  function handleTick(remaining: number) {
    dispatch({ type: "TICK", timeRemaining: remaining });
  }

  function handleReset() {
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
