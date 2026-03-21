"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  generatePhraseSequence,
  generateLissajousSequence,
} from "@iam-protocol/pulse-sdk";
import type { CaptureStage } from "./types";

const MIN_STAGE_MS = 2000;
const PHRASE_SWITCH_MS = 4000;
const AUDIO_BAR_COUNT = 12;
const BAR_OFFSETS = Array.from({ length: AUDIO_BAR_COUNT }, (_, i) =>
  0.6 + 0.4 * Math.sin(i * 1.3)
);

/**
 * Detect IMU capability by listening for actual DeviceMotionEvent data.
 * Returns true if the device produces real accelerometer readings within 1 second.
 */
function useHasIMU(): boolean {
  const [hasIMU, setHasIMU] = useState(false);
  useEffect(() => {
    const DME = (globalThis as any).DeviceMotionEvent;
    if (!DME) return;

    let resolved = false;
    const handler = (e: DeviceMotionEvent) => {
      if (resolved) return;
      if (e.acceleration && (e.acceleration.x || e.acceleration.y || e.acceleration.z)) {
        resolved = true;
        setHasIMU(true);
        window.removeEventListener("devicemotion", handler);
      }
    };

    if (typeof DME.requestPermission === "function") {
      DME.requestPermission()
        .then((p: string) => { if (p === "granted") window.addEventListener("devicemotion", handler); })
        .catch(() => {});
    } else {
      window.addEventListener("devicemotion", handler);
    }

    const timeout = setTimeout(() => {
      if (!resolved) window.removeEventListener("devicemotion", handler);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("devicemotion", handler);
    };
  }, []);
  return hasIMU;
}

// --- Stage indicator dots ---
function StageIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
              i === current
                ? "bg-cyan scale-125 shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                : i < current
                  ? "bg-cyan/40"
                  : "bg-surface"
            }`}
          />
          {i < 2 && (
            <div
              className={`h-px w-8 transition-colors duration-500 ${
                i < current ? "bg-cyan/40" : "bg-surface"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// --- Audio Stage (dynamic phrase switching) ---
function AudioStage({
  phrases,
  audioLevel,
}: {
  phrases: string[];
  audioLevel: number;
}) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % phrases.length);
        setFading(false);
      }, 300);
    }, PHRASE_SWITCH_MS);
    return () => clearInterval(interval);
  }, [phrases.length]);

  const normalizedLevel = Math.min(audioLevel * 5, 1);
  const isVoiceActive = audioLevel > 0.01;
  const phrase = phrases[phraseIndex] ?? phrases[0] ?? "";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-sm font-mono uppercase tracking-widest text-cyan mb-4">
          Speak this phrase
        </p>
        <p
          className={`text-2xl font-mono font-bold transition-all duration-300 ${
            fading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          style={{
            color: isVoiceActive ? "var(--color-foreground)" : "var(--color-muted)",
            textShadow: isVoiceActive
              ? `0 0 ${10 + normalizedLevel * 20}px rgba(0, 240, 255, ${0.15 + normalizedLevel * 0.3})`
              : "none",
          }}
        >
          &ldquo;{phrase}&rdquo;
        </p>
        {phrases.length > 1 && (
          <p className="mt-2 text-xs text-muted font-mono">
            Phrase {phraseIndex + 1} of {phrases.length}
          </p>
        )}
      </div>

      <div className="rounded-lg border border-cyan/40 bg-surface/50 p-4 shadow-[0_0_12px_rgba(0,240,255,0.08)]">
        <div className="h-10 flex items-center justify-center">
          <div className="flex gap-[3px] items-end">
            {BAR_OFFSETS.map((offset, i) => (
              <div
                key={i}
                className="w-1.5 bg-cyan/60 rounded-full"
                style={{
                  height: `${4 + normalizedLevel * 36 * offset}px`,
                  transition: "height 100ms ease",
                }}
              />
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted font-mono text-center">Audio 16kHz</p>
      </div>
    </div>
  );
}

// --- Motion Stage ---
function MotionStage({ hasIMU }: { hasIMU: boolean }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-sm font-mono uppercase tracking-widest text-solana-purple mb-4">
          {hasIMU ? "Hold your device naturally" : "Move your cursor naturally"}
        </p>
        <p className="text-sm text-foreground/70">
          {hasIMU
            ? "Capturing hand tremor and motion dynamics"
            : "Capturing movement dynamics"}
        </p>
      </div>

      <div className="rounded-lg border border-solana-purple/40 bg-surface/50 p-4 shadow-[0_0_12px_rgba(153,69,255,0.08)]">
        <div className="h-10 flex items-center justify-center">
          <div className="flex gap-[3px] items-end">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-2 bg-solana-purple/60 rounded-full animate-pulse"
                style={{
                  height: `${6 + Math.random() * 24}px`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted font-mono text-center">
          {hasIMU ? "IMU" : "Cursor"} 100Hz
        </p>
      </div>
    </div>
  );
}

// --- Touch Stage (dynamic curve switching + visual trace) ---
function TouchStage({
  curves,
  touchRef,
}: {
  curves: { svgPath: string }[];
  touchRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [curveIndex, setCurveIndex] = useState(0);
  const [tracePath, setTracePath] = useState("");
  const traceRef = useRef<string[]>([]);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Switch curve after a few seconds
  useEffect(() => {
    if (curves.length <= 1) return;
    const timer = setTimeout(() => {
      traceRef.current = [];
      setTracePath("");
      setCurveIndex((i) => (i + 1) % curves.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [curveIndex, curves.length]);

  const handlePointer = useCallback((e: PointerEvent) => {
    const container = svgContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200;
    const y = ((e.clientY - rect.top) / rect.height) * 200;
    const cmd = traceRef.current.length === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    traceRef.current.push(cmd);
    setTracePath(traceRef.current.join(""));
  }, []);

  useEffect(() => {
    const el = touchRef?.current;
    if (!el) return;
    el.addEventListener("pointermove", handlePointer as EventListener);
    el.addEventListener("pointerdown", handlePointer as EventListener);
    return () => {
      el.removeEventListener("pointermove", handlePointer as EventListener);
      el.removeEventListener("pointerdown", handlePointer as EventListener);
    };
  }, [touchRef, handlePointer]);

  const currentCurve = curves[curveIndex] ?? curves[0];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-sm font-mono uppercase tracking-widest text-solana-green">
          Trace the curve
        </p>
        {curves.length > 1 && (
          <p className="mt-1 text-xs text-muted font-mono">
            Curve {curveIndex + 1} of {curves.length}
          </p>
        )}
      </div>

      <div
        ref={(node) => {
          (svgContainerRef as any).current = node;
          if (touchRef && "current" in touchRef) (touchRef as any).current = node;
        }}
        className="mx-auto h-[200px] w-[200px] rounded-xl border border-solana-green/50 bg-surface/30 flex items-center justify-center touch-none cursor-crosshair"
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <path
            d={currentCurve?.svgPath ?? ""}
            fill="none"
            stroke="var(--color-solana-green)"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          {tracePath && (
            <path
              d={tracePath}
              fill="none"
              stroke="var(--color-solana-green)"
              strokeWidth="2"
              strokeOpacity="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>

      <div className="rounded-lg border border-solana-green/40 bg-surface/50 p-4 shadow-[0_0_12px_rgba(20,241,149,0.08)]">
        <div className="h-10 flex items-center justify-center">
          <div className="flex gap-[3px] items-end">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-solana-green/60 rounded-full animate-pulse"
                style={{
                  height: `${5 + Math.random() * 28}px`,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted font-mono text-center">Touch 120Hz</p>
      </div>
    </div>
  );
}

// --- Main Component ---
export function PulseChallenge({
  stage,
  onNext,
  touchRef,
  audioLevel = 0,
}: {
  stage: CaptureStage;
  onNext: () => void;
  touchRef?: React.RefObject<HTMLDivElement | null>;
  audioLevel?: number;
}) {
  const [canAdvance, setCanAdvance] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasIMU = useHasIMU();

  // Generate dynamic challenge sequences once per session
  const phrases = useMemo(() => generatePhraseSequence(3, 4), []);
  const curves = useMemo(() => {
    const seq = generateLissajousSequence(2);
    return seq.map(({ points }) => {
      if (points.length === 0) return { svgPath: "" };
      const first = points[0]!;
      const svgPath =
        `M ${first.x * 100 + 100} ${first.y * 100 + 100}` +
        points.slice(1).map((p) => ` L ${p.x * 100 + 100} ${p.y * 100 + 100}`).join("");
      return { svgPath };
    });
  }, []);

  useEffect(() => {
    setCanAdvance(false);
    timerRef.current = setTimeout(() => setCanAdvance(true), MIN_STAGE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage]);

  const stageIndex = stage === "audio" ? 0 : stage === "motion" ? 1 : 2;
  const isLast = stage === "touch";

  return (
    <div className="space-y-6">
      <StageIndicator current={stageIndex} />

      <p className="text-center text-xs font-mono uppercase tracking-widest text-cyan">
        Stage {stageIndex + 1} of 3
      </p>

      {stage === "audio" && (
        <AudioStage phrases={phrases} audioLevel={audioLevel} />
      )}
      {stage === "motion" && <MotionStage hasIMU={hasIMU} />}
      {stage === "touch" && <TouchStage curves={curves} touchRef={touchRef} />}

      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className={`rounded-full border px-8 py-3 text-sm font-mono transition-all duration-200 ${
            canAdvance
              ? "border-cyan/50 text-cyan hover:bg-cyan/10 hover:border-cyan cursor-pointer"
              : "border-border text-muted cursor-not-allowed opacity-50"
          }`}
        >
          {isLast ? "Done" : "Next"} →
        </button>
      </div>

      <p className="text-center text-xs text-muted">
        All sensor data stays on your device. Only the ZK proof leaves.
      </p>
    </div>
  );
}
