"use client";

import { useEffect, useRef } from "react";

const CHALLENGE_PHRASES = [
  "Oro rura lamo ree see",
  "Vix nalo tehu fra mip",
  "Belu karo sani wep toz",
  "Jafi molu dren pux yab",
];

function getRandomPhrase(): string {
  const index = Math.floor(Math.random() * CHALLENGE_PHRASES.length);
  return CHALLENGE_PHRASES[index] ?? CHALLENGE_PHRASES[0]!;
}

export function PulseChallenge({
  timeRemaining,
  onComplete,
  onTick,
}: {
  timeRemaining: number;
  onComplete: () => void;
  onTick: (remaining: number) => void;
}) {
  const phraseRef = useRef(getRandomPhrase());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(timeRemaining);

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

  const progress = ((7 - timeRemaining) / 7) * 100;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-sm font-mono uppercase tracking-widest text-cyan mb-2">
          Speak this phrase
        </p>
        <p className="text-2xl font-mono font-bold text-foreground">
          &ldquo;{phraseRef.current}&rdquo;
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-muted">
          <span>Capturing</span>
          <span>{timeRemaining}s remaining</span>
        </div>
        <div className="h-2 rounded-full bg-surface overflow-hidden">
          <div
            className="h-full rounded-full bg-cyan transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg border border-border bg-surface/50 p-3">
          <div className="h-8 flex items-center justify-center">
            <div className="flex gap-[2px] items-end">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyan/60 rounded-full animate-pulse"
                  style={{
                    height: `${8 + Math.random() * 20}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted font-mono">Audio 16kHz</p>
        </div>

        <div className="rounded-lg border border-border bg-surface/50 p-3">
          <div className="h-8 flex items-center justify-center">
            <div className="flex gap-[2px] items-end">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-solana-purple/60 rounded-full animate-pulse"
                  style={{
                    height: `${6 + Math.random() * 18}px`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted font-mono">IMU 100Hz</p>
        </div>

        <div className="rounded-lg border border-border bg-surface/50 p-3">
          <div className="h-8 flex items-center justify-center">
            <div className="flex gap-[2px] items-end">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-solana-green/60 rounded-full animate-pulse"
                  style={{
                    height: `${5 + Math.random() * 22}px`,
                    animationDelay: `${i * 0.12}s`,
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
