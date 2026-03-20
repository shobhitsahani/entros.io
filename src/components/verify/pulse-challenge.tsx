"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  generatePhrase,
  randomLissajousParams,
  generateLissajousPoints,
} from "@iam-protocol/pulse-sdk";

const TOTAL_DURATION = 21;
const STAGE_DURATION = 7;

type Stage = "audio" | "motion" | "touch";

function getActiveStage(timeRemaining: number): Stage {
  const elapsed = TOTAL_DURATION - timeRemaining;
  if (elapsed < STAGE_DURATION) return "audio";
  if (elapsed < STAGE_DURATION * 2) return "motion";
  return "touch";
}

function getStageTimeRemaining(timeRemaining: number): number {
  const elapsed = TOTAL_DURATION - timeRemaining;
  const stageElapsed = elapsed % STAGE_DURATION;
  return STAGE_DURATION - stageElapsed;
}

export function PulseChallenge({
  timeRemaining,
  onComplete,
  onTick,
  touchRef,
}: {
  timeRemaining: number;
  onComplete: () => void;
  onTick: (remaining: number) => void;
  touchRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const phraseRef = useRef(generatePhrase(5));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(timeRemaining);

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

  useEffect(() => {
    remainingRef.current = timeRemaining;

    if (timeRemaining <= 0) {
      onComplete();
      return;
    }

    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      remainingRef.current -= 1;
      if (remainingRef.current <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        onComplete();
      } else {
        onTick(remainingRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const activeStage = getActiveStage(timeRemaining);
  const stageSeconds = getStageTimeRemaining(timeRemaining);
  const overallProgress = ((TOTAL_DURATION - timeRemaining) / TOTAL_DURATION) * 100;

  const stageIndex = activeStage === "audio" ? 0 : activeStage === "motion" ? 1 : 2;

  return (
    <div className="space-y-6">
      {/* Stage indicator dots */}
      <div className="flex items-center justify-center gap-3">
        {(["audio", "motion", "touch"] as const).map((stage, i) => (
          <div key={stage} className="flex items-center gap-3">
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                stage === activeStage
                  ? "bg-cyan scale-125 shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                  : i < stageIndex
                    ? "bg-cyan/40"
                    : "bg-surface"
              }`}
            />
            {i < 2 && (
              <div
                className={`h-px w-8 transition-colors duration-500 ${
                  i < stageIndex ? "bg-cyan/40" : "bg-surface"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Stage label */}
      <p className="text-center text-xs font-mono uppercase tracking-widest text-cyan">
        Stage {stageIndex + 1} of 3 — {stageSeconds}s
      </p>

      {/* Audio stage */}
      <div
        className={`text-center transition-all duration-500 ${
          activeStage === "audio" ? "opacity-100" : "opacity-25 scale-95"
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
          activeStage === "motion" ? "opacity-100" : "opacity-25 scale-95"
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
          activeStage === "touch" ? "opacity-100" : "opacity-25 scale-95"
        }`}
      >
        <p className="text-center text-sm font-mono uppercase tracking-widest text-solana-green mb-3">
          Trace the curve
        </p>
        <div
          ref={touchRef}
          className={`mx-auto h-[160px] w-[160px] rounded-xl border bg-surface/30 flex items-center justify-center touch-none transition-colors duration-500 ${
            activeStage === "touch" ? "border-solana-green/50" : "border-border"
          }`}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full">
            <path
              d={svgPath}
              fill="none"
              stroke={
                activeStage === "touch"
                  ? "var(--color-solana-green)"
                  : "var(--color-subtle)"
              }
              strokeWidth="1.5"
              strokeOpacity={activeStage === "touch" ? 0.7 : 0.2}
            />
          </svg>
        </div>
      </div>

      {/* Overall progress */}
      <div className="space-y-2">
        <div className="h-1.5 rounded-full bg-surface overflow-hidden">
          <div
            className="h-full rounded-full bg-cyan transition-all duration-1000 ease-linear"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Sensor indicators */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div
          className={`rounded-lg border bg-surface/50 p-3 transition-all duration-500 ${
            activeStage === "audio"
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
                    animationPlayState:
                      activeStage === "audio" ? "running" : "paused",
                  }}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted font-mono">Audio 16kHz</p>
        </div>

        <div
          className={`rounded-lg border bg-surface/50 p-3 transition-all duration-500 ${
            activeStage === "motion"
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
                    animationPlayState:
                      activeStage === "motion" ? "running" : "paused",
                  }}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted font-mono">IMU 100Hz</p>
        </div>

        <div
          className={`rounded-lg border bg-surface/50 p-3 transition-all duration-500 ${
            activeStage === "touch"
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
                    animationPlayState:
                      activeStage === "touch" ? "running" : "paused",
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
