"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { type PulseSession, PROGRAM_IDS, fetchChallenge } from "@entros/pulse-sdk";
import type { VerifyState, VerifyAction } from "@/components/verify/types";
import { PulseChallenge } from "@/components/verify/pulse-challenge";
import {
  ProvingView,
  SigningView,
  VerifiedView,
  FailedView,
  SoftFailedView,
} from "@/components/verify/step-views";
import { ResetBaselineDialog } from "@/components/verify/reset-baseline-dialog";
import { WalletConnectButton } from "@/components/ui/wallet-connect-button";
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
  const { connected, wallet, publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  const pulse = usePulse();
  const touchRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<PulseSession | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasMotion, setHasMotion] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [processingStage, setProcessingStage] = useState("Extracting features...");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  // Unix seconds of the connected wallet's most recent on-chain verification,
  // read directly from IdentityState offset 48. Used to render a cadence hint
  // explaining that Trust Score only increments after a 24-hour gap—the
  // sliding-window dedup in update_anchor's recency formula collapses
  // verifications inside the same 24h slice into one contribution, so
  // verifying twice within 24h is a UX surprise unless we flag it.
  const [lastVerificationTimestamp, setLastVerificationTimestamp] = useState<number | null>(null);
  // Server-issued challenge phrase (master-list #89). Fetched from the
  // executor's /challenge endpoint during handleStart so the PulseChallenge
  // displays the authoritative phrase the validation service will
  // phoneme-match. Null when no fetch has happened yet or the executor was
  // unreachable—PulseChallenge falls back to client-generated copy in
  // that case and phrase content binding skips server-side (Tier 1 still
  // runs).
  const [challengePhrase, setChallengePhrase] = useState<string | null>(null);
  const startingRef = useRef(false);
  const voicedFramesRef = useRef(0);
  // Intent is tracked alongside the state-machine mirror so the
  // capture-completion handler can choose between verify vs reset paths
  // without reading the reducer state (which may race the handler).
  const intentRef = useRef<"verify" | "reset">("verify");
  // Soft-reject retry budget (master-list #94). Counts attempts taken in the
  // current session—incremented at the top of handleStart, reset to 0 on
  // RESET / VERIFICATION_SUCCESS. When attemptsUsed < MAX_ATTEMPTS and the
  // server returns a user-recoverable reason, we route to soft_failed (retry
  // available) instead of failed (hard stop). Capped to bound bot retry
  // benefit per wallet—the server-side per-wallet cap (master-list #94 C4)
  // enforces this across wallet refreshes; this client counter just drives
  // the UX inside a session.
  const MAX_ATTEMPTS = 3;
  const attemptsUsedRef = useRef(0);

  useEffect(() => {
    setHasMotion(navigator.maxTouchPoints > 0);
  }, []);

  // Pull `last_verification_timestamp` from IdentityState when a wallet with
  // an existing on-chain anchor is connected. Only used for the cadence hint
  // below; fails silently if the account doesn't exist or the fetch errors
  // (first-time users + network blips render the idle view without the hint).
  useEffect(() => {
    if (!publicKey || !connected) {
      setLastVerificationTimestamp(null);
      return;
    }
    let cancelled = false;
    const programId = new PublicKey(PROGRAM_IDS.entrosAnchor);
    const [identityPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode("identity"), publicKey.toBuffer()],
      programId,
    );
    connection
      .getAccountInfo(identityPda)
      .then((account: { data: Uint8Array } | null) => {
        if (cancelled || !account || account.data.length < 56) return;
        const view = new DataView(
          account.data.buffer,
          account.data.byteOffset,
          account.data.byteLength,
        );
        const ts = Number(view.getBigInt64(48, true));
        if (ts > 0) setLastVerificationTimestamp(ts);
      })
      .catch(() => {
        /* silent—hint just doesn't render */
      });
    return () => {
      cancelled = true;
    };
  }, [publicKey, connected, connection]);

  async function handleStart(intent: "verify" | "reset" = "verify") {
    if (startingRef.current) return;
    startingRef.current = true;
    // Verify and reset are different operations and must not share the
    // retry budget. If the user just exhausted 3 verify attempts and now
    // clicks "Reset baseline", the reset capture starts with a fresh
    // budget—otherwise any borderline failure during reset would
    // immediately route to hard-fail (because attemptsUsedRef >= MAX).
    if (intentRef.current !== intent) {
      attemptsUsedRef.current = 0;
    }
    intentRef.current = intent;
    setRequesting(true);
    setChallengePhrase(null);
    // Count this attempt against the (intent-scoped) session budget.
    // Soft-fail / hard-fail routing in handleCaptureComplete reads from
    // this counter.
    attemptsUsedRef.current += 1;

    try {
      voicedFramesRef.current = 0;

      // Fire the challenge fetch in parallel with sensor setup. We do NOT
      // await this before requesting motion permission: `DeviceMotionEvent
      // .requestPermission()` on iOS consumes the active user-gesture token,
      // and awaiting a network round-trip between the click and the motion
      // prompt silently drops that token—motion permission denied.
      // Awaiting happens after audio/motion/touch permissions resolve but
      // before START_CAPTURE, so the PulseChallenge renders with whichever
      // phrase is ready by then (server-issued, or null → client fallback).
      const relayerUrl = process.env.NEXT_PUBLIC_RELAYER_URL;
      const relayerApiKey = process.env.NEXT_PUBLIC_RELAYER_API_KEY;
      const challengePromise: Promise<string | null> =
        publicKey && relayerUrl
          ? fetchChallenge(relayerUrl, publicKey.toBase58(), relayerApiKey)
              .then((c) => c.phrase)
              .catch((err: unknown) => {
                const msg = err instanceof Error ? err.message : String(err);
                console.warn(`[verify] challenge fetch failed: ${msg}`);
                return null;
              })
          : Promise.resolve(null);

      // Always attach touch capture to document.body. The PulseChallenge
      // curve DIV is only mounted AFTER we dispatch START_CAPTURE below, so
      // touchRef.current at this point is either null (first run) or a
      // detached node from a prior render (retained because
      // pulse-challenge.tsx assigns the ref manually in a useEffect with
      // no unmount cleanup). Using the detached node silently broke the
      // reset flow: pointer events fired on the new DIV but listeners sat
      // on the dead one, yielding 0 touch samples.
      const session = pulse.createSession(document.body);
      sessionRef.current = session;

      // Motion first—DeviceMotionEvent.requestPermission() requires an active
      // user gesture on iOS. getUserMedia does not. If audio goes first, the gesture
      // token is consumed by the mic dialog and motion is silently denied.
      if (hasMotion) {
        try {
          await session.startMotion();
          if (!session.isMotionCapturing()) {
            dispatch({
              type: "VERIFICATION_FAILED",
              error: "Motion permission denied. Please allow motion access and try again.",
            });
            return;
          }
        } catch {
          dispatch({
            type: "VERIFICATION_FAILED",
            error: "Motion permission denied. Please allow motion access and try again.",
          });
          return;
        }
      } else {
        session.skipMotion();
      }

      // Audio second—getUserMedia works without a gesture on secure origins
      try {
        let audioFrameCount = 0;
        await session.startAudio((rms) => {
          if (rms > 0.008) voicedFramesRef.current++;
          audioFrameCount++;
          if (audioFrameCount % 2 === 0) setAudioLevel(rms);
        });
      } catch {
        dispatch({
          type: "VERIFICATION_FAILED",
          error: "Microphone access denied. Please allow microphone permission and try again.",
        });
        return;
      }

      session.startTouch().catch(() => session.skipTouch());

      // Await the parallel challenge fetch now that permissions have
      // resolved. The 3-second countdown inside PulseChallenge gives
      // another buffer for slow networks before the phrase appears.
      const phrase = await challengePromise;
      if (phrase) setChallengePhrase(phrase);

      dispatch({ type: "START_CAPTURE", intent });
    } finally {
      startingRef.current = false;
      setRequesting(false);
    }
  }

  function handleResetBaselineClick() {
    setResetDialogOpen(true);
  }

  async function handleResetBaselineConfirm() {
    setResetDialogOpen(false);
    // The state machine allows START_CAPTURE from failed (see reducer).
    // Dispatch with reset intent; handleCaptureComplete will route to
    // session.completeReset() because intentRef is now "reset".
    await handleStart("reset");
  }

  async function handleCaptureComplete() {
    const session = sessionRef.current;
    if (!session) return;

    try { await session.stopAudio(); } catch { /* skipped */ }
    try { await session.stopMotion(); } catch { /* skipped */ }
    try { await session.stopTouch(); } catch { /* skipped */ }

    dispatch({ type: "CAPTURE_DONE" });

    const PROOF_TIMEOUT_MS = 60_000;
    const proofPromise =
      intentRef.current === "reset"
        ? session.completeReset(wallet?.adapter, connection, (stage) => {
            setProcessingStage(stage);
          })
        : session.complete(wallet?.adapter, connection, (stage) => {
            setProcessingStage(stage);
          });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Proof generation timed out. Please try again.")), PROOF_TIMEOUT_MS)
    );

    // Set of safe-to-reveal validator reasons that route to the soft-fail
    // retry UX instead of the hard-fail page. Must stay in sync with
    // `entros-validation::ReasonCode::safe_label` (the server-side allowlist)
    // and `SOFT_HINT` keys in `step-views.tsx` (the client-side hint
    // dictionary). Drift in either direction means a soft-rejectable reason
    // either escapes to hard-fail (annoying for the user) or slips into
    // soft-fail without a hint (confusing).
    const RETRYABLE_REASONS = new Set([
      "variance_floor",
      "entropy_bounds",
      "temporal_coupling_low",
      "phrase_content_mismatch",
    ]);

    Promise.race([proofPromise, timeoutPromise])
      .then((result) => {
        dispatch({ type: "PROOF_COMPLETE" });
        if (result.success) {
          attemptsUsedRef.current = 0;
          dispatch({
            type: "VERIFICATION_SUCCESS",
            commitment: commitmentToHex(result.commitment),
            txSignature: result.txSignature,
          });
          return;
        }
        const reason = result.reason;
        const canRetry =
          typeof reason === "string" &&
          RETRYABLE_REASONS.has(reason) &&
          attemptsUsedRef.current < MAX_ATTEMPTS;
        if (canRetry) {
          dispatch({
            type: "VERIFICATION_SOFT_FAILED",
            reason: reason as string,
            attemptsRemaining: MAX_ATTEMPTS - attemptsUsedRef.current,
          });
          return;
        }
        dispatch({
          type: "VERIFICATION_FAILED",
          error: result.error ?? "Verification failed",
        });
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
    (touchRef as React.MutableRefObject<HTMLDivElement | null>).current = null;
    setAudioLevel(0);
    // Wipe the retry budget when the user explicitly resets—a fresh
    // session starts at 0 attempts used.
    attemptsUsedRef.current = 0;
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
    const truncatedAddress = publicKey
      ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
      : "";

    // 24-hour cadence hint: the Trust Score recency dedup in update_anchor
    // collapses verifications inside a single 24h window into one bucket, so
    // verifying sooner than 24h after the last attempt won't produce a
    // recency bump (and older entries aging can make the score slightly
    // dip). Surface a one-line explainer so users don't get surprised.
    const DAY_SEC = 86400;
    const nowSec = Math.floor(Date.now() / 1000);
    const secondsSinceLastVerif =
      lastVerificationTimestamp !== null ? nowSec - lastVerificationTimestamp : null;
    const showCadenceHint =
      secondsSinceLastVerif !== null &&
      secondsSinceLastVerif >= 0 &&
      secondsSinceLastVerif < DAY_SEC;
    const hoursAgo =
      showCadenceHint && secondsSinceLastVerif !== null
        ? Math.floor(secondsSinceLastVerif / 3600)
        : 0;
    const hoursUntilNext =
      showCadenceHint && secondsSinceLastVerif !== null
        ? Math.max(1, Math.ceil((DAY_SEC - secondsSinceLastVerif) / 3600))
        : 0;
    const hoursAgoLabel =
      hoursAgo === 0 ? "less than an hour" : `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"}`;
    const hoursUntilNextLabel =
      hoursUntilNext === 1 ? "1 more hour" : `${hoursUntilNext} more hours`;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-1.5 mb-4">
            <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-xs text-cyan">{truncatedAddress}</span>
            <button
              onClick={() => disconnect()}
              className="ml-1 text-xs text-foreground/40 hover:text-foreground transition-colors"
              aria-label="Disconnect wallet"
            >
              &times;
            </button>
          </div>
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
        {showCadenceHint && (
          <div className="mx-auto max-w-sm rounded-lg border border-cyan/20 bg-cyan/5 px-4 py-3">
            <p className="text-center text-xs text-foreground/70 leading-relaxed">
              You verified {hoursAgoLabel} ago. Trust Score increments fully
              when verifications are spaced 24+ hours apart—wait{" "}
              {hoursUntilNextLabel} for the next bump.
            </p>
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={() => handleStart("verify")}
            disabled={requesting}
            className="
              inline-flex items-center justify-center gap-2
              rounded-full bg-foreground px-6 py-3
              text-sm font-medium text-background
              transition-colors hover:bg-foreground/90
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {requesting ? "Requesting access..." : "Start Verification"}
          </button>
        </div>
        <p className="text-center text-xs text-muted">
          Raw data stays on your device. Only the ZK proof and a statistical summary leave.
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
        phrase={challengePhrase ?? undefined}
      />
    );
  }

  if (state.step === "processing") return <ProvingView stage={processingStage} />;
  if (state.step === "signing") return <SigningView />;

  if (state.step === "soft_failed") {
    return (
      <SoftFailedView
        reason={state.reason}
        attemptsRemaining={state.attemptsRemaining}
        onTryAgain={() => handleStart(state.intent)}
        onCancel={handleReset}
      />
    );
  }

  if (state.step === "verified") {
    const wasReset = state.intent === "reset";
    return (
      <VerifiedView
        commitment={state.commitment}
        txSignature={state.txSignature}
        title={wasReset ? "Baseline reset" : "Verified"}
        subtitle={
          wasReset
            ? "Fresh baseline stored on this device. Trust Score starts at 0 and rebuilds with future verifications."
            : "Transaction confirmed on Solana devnet"
        }
        tryAgainLabel={wasReset ? "Verify now" : "Verify again"}
        onReset={handleReset}
      />
    );
  }

  if (state.step === "failed") {
    return (
      <>
        <FailedView
          error={state.error}
          onReset={handleReset}
          onResetBaseline={handleResetBaselineClick}
        />
        <ResetBaselineDialog
          open={resetDialogOpen}
          onCancel={() => setResetDialogOpen(false)}
          onConfirm={handleResetBaselineConfirm}
        />
      </>
    );
  }

  return null;
}
