"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const COLS = 96;
const ROWS = 28;
const FRAME_INTERVAL_MS = 33;

const HEX_ROW_MIN = 3;
const HEX_ROW_MAX = 23;
const HEX_ROW_CENTER = (HEX_ROW_MIN + HEX_ROW_MAX) / 2;

const WAVE_SPEED = 34;
const WAVE_TILT = 0.55;
const WAVE_HALF_WIDTH = 16;
const WAVE_RESET_PAD = 12;

interface HexNode {
  col: number;
  row: number;
  char: number;
}

interface AsciiHexProps {
  className?: string;
}

export function AsciiHex({ className }: AsciiHexProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const tierBuffer = new Uint8Array(COLS * ROWS);
    const charBuffer = new Uint8Array(COLS * ROWS);

    const nodes: HexNode[] = [];
    for (let r = HEX_ROW_MIN; r < HEX_ROW_MAX; r++) {
      const offset = r % 2;
      for (let c = offset; c < COLS; c += 2) {
        nodes.push({
          col: c,
          row: r,
          char: Math.random() < 0.5 ? 0 : 1,
        });
      }
    }

    let waveX = -WAVE_RESET_PAD;
    let rafId = 0;
    let lastFrame = 0;
    let prev = performance.now();
    let inView = true;

    function render(now: number) {
      if (now - lastFrame < FRAME_INTERVAL_MS) {
        if (inView) rafId = requestAnimationFrame(render);
        return;
      }
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      lastFrame = now;

      waveX += WAVE_SPEED * dt;
      if (waveX > COLS + WAVE_RESET_PAD) waveX = -WAVE_RESET_PAD;

      tierBuffer.fill(0);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        const linePos = waveX + (n.row - HEX_ROW_CENTER) * WAVE_TILT;
        const dist = Math.abs(n.col - linePos);
        let tier: number;
        if (dist < WAVE_HALF_WIDTH * 0.2) tier = 4;
        else if (dist < WAVE_HALF_WIDTH * 0.45) tier = 3;
        else if (dist < WAVE_HALF_WIDTH * 0.75) tier = 2;
        else tier = 1;

        const idx = n.row * COLS + n.col;
        tierBuffer[idx] = tier;
        charBuffer[idx] = n.char;
      }

      let html = "";
      let lastTier = -1;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c;
          const tier = tierBuffer[idx]!;
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
          html += charBuffer[idx] === 0 ? "0" : "1";
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
