"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  generatePhrase,
  randomLissajousParams,
  generateLissajousPoints,
} from "@iam-protocol/pulse-sdk";
import type { CaptureStage } from "./types";

const STAGE_LABELS: Record<CaptureStage, { index: number; label: string; color: string }> = {
  audio: { index: 0, label: "Audio", color: "cyan" },
  motion: { index: 1, label: "Motion", color: "solana-purple" },
  touch: { index: 2, label: "Touch", color: "solana-green" },
};

const MIN_STAGE_MS = 2000;

export function PulseChallenge({
  stage,
  onNext,
  touchRef,
}: {
  stage: CaptureStage;
  onNext: () => void;
  touchRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const phraseRef = useRef(generatePhrase(5));
  const [canAdvance, setCanAdvance] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lissajousPoints = useMemo(() => {
    const params = randomLissajousParams();
    return generateLissajousPoints(params);
  }, []);

  const svgPath = useMemo(() => {
    if (lissajousPoints.length === 0) return "";
    const first = lissajousPoints[0]!;
    return (
      `M ${first.x * 100 + 100} ${first.y * 100 + 100}` +
      lissajousPoints
        .slice(1)
        .map((p) => ` L ${p.x * 100 + 100} ${p.y * 100 + 100}`)
        .join("")
    );
  }, [lissajousPoints]);

  // Reset the minimum-time guard when stage changes
  useEffect(() => {
    setCanAdvance(false);
    timerRef.current = setTimeout(() => setCanAdvance(true), MIN_STAGE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage]);

  const info = STAGE_LABELS[stage];
  const isLast = stage === "touch";

  return (
    <div className="space-y-6">
      {/* Stage indicator dots */}
      <div className="flex items-center justify-center gap-3">
        {(["audio", "motion", "touch"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                s === stage
                  ? "bg-cyan scale-125 shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                  : i < info.index
                    ? "bg-cyan/40"
                    : "bg-surface"
              }`}
            />
            {i < 2 && (
              <div
                className={`h-px w-8 transition-colors duration-500 ${
                  i < info.index ? "bg-cyan/40" : "bg-surface"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Stage label */}
      <p className="text-center text-xs font-mono uppercase tracking-widest text-cyan">
        Stage {info.index + 1} of 3
      </p>

      {/* Audio stage */}
      <div
        className={`text-center transition-all duration-500 ${
          stage === "audio" ? "opacity-100" : "opacity-25 scale-95"
        }`}
      >
        <p className="text-sm font-mono uppercase tracking-widest text-cyan mb-2">
          Speak this phrase
        </p>
        <p className="text-2xl font-mono font-bold text-foreground">
          &ldquo;{phraseRef.current}&rdquo;
        </p>
      </div>

      {/* Motion stage */}
      <div
        className={`text-center transition-all duration-500 ${
          stage === "motion" ? "opacity-100" : "opacity-25 scale-95"
        }`}
      >
        <p className="text-sm font-mono uppercase tracking-widest text-solana-purple mb-2">
          Hold your device naturally
        </p>
        <p className="text-sm text-foreground/70">
          Capturing hand tremor and motion dynamics
        </p>
      </div>

      {/* Touch stage */}
      <div
        className={`transition-all duration-500 ${
          stage === "touch" ? "opacity-100" : "opacity-25 scale-95"
        }`}
      >
        <p className="text-center text-sm font-mono uppercase tracking-widest text-solana-green mb-3">
          Trace the curve
        </p>
        <div
          ref={touchRef}
          className={`mx-auto h-[160px] w-[160px] rounded-xl border bg-surface/30 flex items-center justify-center touch-none transition-colors duration-500 ${
            stage === "touch" ? "border-solana-green/50" : "border-border"
          }`}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full">
            <path
              d={svgPath}
              fill="none"
              stroke={
                stage === "touch"
                  ? "var(--color-solana-green)"
                  : "var(--color-subtle)"
              }
              strokeWidth="1.5"
              strokeOpacity={stage === "touch" ? 0.7 : 0.2}
            />
          </svg>
        </div>
      </div>

      {/* Next / Done button */}
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

      {/* Sensor indicators */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div
          className={`rounded-lg border bg-surface/50 p-3 transition-all duration-500 ${
            stage === "audio"
              ? "border-cyan/40 shadow-[0_0_12px_rgba(0,240,255,0.08)]"
              : "border-border opacity-40"
          }`}
        >
          <div className="h-8 flex items-center justify-center">
            <div className="flex gap-[2px] items-end">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyan/60 rounded-full animate-pulse"
                  style={{
                    height: `${8 + Math.random() * 20}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationPlayState: stage === "audio" ? "running" : "paused",
                  }}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted font-mono">Audio 16kHz</p>
        </div>

        <div
          className={`rounded-lg border bg-surface/50 p-3 transition-all duration-500 ${
            stage === "motion"
              ? "border-solana-purple/40 shadow-[0_0_12px_rgba(153,69,255,0.08)]"
              : "border-border opacity-40"
          }`}
        >
          <div className="h-8 flex items-center justify-center">
            <div className="flex gap-[2px] items-end">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-solana-purple/60 rounded-full animate-pulse"
                  style={{
                    height: `${6 + Math.random() * 18}px`,
                    animationDelay: `${i * 0.15}s`,
                    animationPlayState: stage === "motion" ? "running" : "paused",
                  }}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted font-mono">IMU 100Hz</p>
        </div>

        <div
          className={`rounded-lg border bg-surface/50 p-3 transition-all duration-500 ${
            stage === "touch"
              ? "border-solana-green/40 shadow-[0_0_12px_rgba(20,241,149,0.08)]"
              : "border-border opacity-40"
          }`}
        >
          <div className="h-8 flex items-center justify-center">
            <div className="flex gap-[2px] items-end">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-solana-green/60 rounded-full animate-pulse"
                  style={{
                    height: `${5 + Math.random() * 22}px`,
                    animationDelay: `${i * 0.12}s`,
                    animationPlayState: stage === "touch" ? "running" : "paused",
                  }}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted font-mono">Touch 120Hz</p>
        </div>
      </div>

      <p className="text-center text-xs text-muted">
        All sensor data stays on your device. Only the ZK proof leaves.
      </p>
    </div>
  );
}
