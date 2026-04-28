"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const COLS = 96;
const ROWS = 28;
const X_CENTER_COL = 48;
const Y_CENTER_ROW = 11;
const X_SCALE = 40;
const Y_SCALE = 20;
const FRAME_INTERVAL_MS = 33;

interface Ring {
  radius: number;
  count: number;
  omega: number;
  tier: number;
}

const RINGS: Ring[] = [
  { radius: 0.16, count: 56, omega: 1.5, tier: 3 },
  { radius: 0.28, count: 96, omega: -1.0, tier: 3 },
  { radius: 0.40, count: 140, omega: 0.62, tier: 2 },
  { radius: 0.50, count: 180, omega: -0.38, tier: 1 },
];

const CENTER_NODE_RADIUS = 0.085;
const CENTER_R_STEP = 0.012;
const CENTER_ANG_STEP = 0.22;

interface AsciiOrbitProps {
  className?: string;
}

export function AsciiOrbit({ className }: AsciiOrbitProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const tierBuffer = new Uint8Array(COLS * ROWS);

    let phase = 0;
    let rafId = 0;
    let lastFrame = 0;
    let prev = performance.now();
    let inView = true;

    function plot(col: number, row: number, tier: number) {
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
      const idx = row * COLS + col;
      if (tier > tierBuffer[idx]!) tierBuffer[idx] = tier;
    }

    function render(now: number) {
      if (now - lastFrame < FRAME_INTERVAL_MS) {
        if (inView) rafId = requestAnimationFrame(render);
        return;
      }
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      lastFrame = now;

      phase += dt;

      tierBuffer.fill(0);
      const TWO_PI = Math.PI * 2;

      for (let r = 0; r <= CENTER_NODE_RADIUS; r += CENTER_R_STEP) {
        for (let a = 0; a < TWO_PI; a += CENTER_ANG_STEP) {
          const col = Math.round(X_CENTER_COL + r * Math.cos(a) * X_SCALE);
          const row = Math.round(Y_CENTER_ROW - r * Math.sin(a) * Y_SCALE);
          plot(col, row, 4);
        }
      }

      for (const ring of RINGS) {
        const baseAngle = ring.omega * phase;
        const stride = TWO_PI / ring.count;
        for (let i = 0; i < ring.count; i++) {
          const a = baseAngle + i * stride;
          const col = Math.round(
            X_CENTER_COL + ring.radius * Math.cos(a) * X_SCALE
          );
          const row = Math.round(
            Y_CENTER_ROW - ring.radius * Math.sin(a) * Y_SCALE
          );
          const tier = i % 5 === 0 ? Math.min(ring.tier + 1, 4) : ring.tier;
          plot(col, row, tier);
        }
      }

      let html = "";
      let lastTier = -1;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const tier = tierBuffer[r * COLS + c]!;
          if (tier === 0) {
            if (lastTier !== -1) html += "</span>";
            html += " ";
            lastTier = -1;
            continue;
          }
          if (tier !== lastTier) {
            if (lastTier !== -1) html += "</span>";
            const cls =
              tier === 1
                ? "text-cyan/25"
                : tier === 2
                  ? "text-cyan/50"
                  : tier === 3
                    ? "text-cyan/75"
                    : "text-cyan";
            html += `<span class="${cls}">`;
          }
          html += tier === 4 ? "0" : "1";
          lastTier = tier;
        }
        if (lastTier !== -1) {
          html += "</span>";
          lastTier = -1;
        }
        if (r < ROWS - 1) html += "\n";
      }
      pre!.innerHTML = html;

      if (inView) rafId = requestAnimationFrame(render);
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    render(performance.now() + FRAME_INTERVAL_MS + 1);

    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const wasInView = inView;
        inView = entry.isIntersecting;
        if (!wasInView && inView) rafId = requestAnimationFrame(render);
      },
      { threshold: 0 }
    );
    observer.observe(pre);

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <pre
      ref={preRef}
      aria-hidden="true"
      className={cn(
        "select-none whitespace-pre font-mono leading-[1] text-cyan",
        "ascii-art-bright",
        "text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-[12px]",
        className
      )}
    />
  );
}
