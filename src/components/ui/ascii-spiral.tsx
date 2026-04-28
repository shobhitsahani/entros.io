"use client";

/**
 * AsciiSpiral—animated 3D rotating disk rendered as monospace text.
 *
 * The frame data is a 75-frame sequence at 80×80 cells, encoded as
 * gzipped base64 in `ascii-spiral-data.ts` (~30KB). Density characters
 * (▪ dense, ▫ mid, · sparse) carry the depth gradient; a single CSS
 * color paints the whole animation in brand cyan.
 *
 * Runtime: decode payload via DecompressionStream → split frames → swap
 * textContent on a fixed <pre> at 30fps. O(1) frame swap, negligible CPU.
 *
 * Performance / a11y
 * ─────────────────
 * • Decoding is async; <pre> shows nothing (or first frame) until ready.
 * • IntersectionObserver pauses the rAF loop when offscreen.
 * • prefers-reduced-motion → render only frame 0 and stop.
 * • aria-hidden on the <pre>; the surrounding region carries the label.
 */

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SPIRAL_PAYLOAD_B64 } from "./ascii-spiral-data";

const FRAME_INTERVAL_MS = 33; // ~30fps, matches the original FPS=30

async function decodeFrames(payload: string): Promise<string[]> {
  const binary = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
  const stream = new Blob([binary as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  const text = await new Response(stream).text();
  return text.split("\x00");
}

interface AsciiSpiralProps {
  className?: string;
}

export function AsciiSpiral({ className }: AsciiSpiralProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    let rafId = 0;
    let lastFrameTime = 0;
    let frameIdx = 0;
    let inView = true;
    let cancelled = false;
    let frames: string[] = [];

    const render = (now: number) => {
      if (now - lastFrameTime < FRAME_INTERVAL_MS) {
        if (inView) rafId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = now;
      pre.textContent = frames[frameIdx % frames.length] ?? "";
      frameIdx++;
      if (inView) rafId = requestAnimationFrame(render);
    };

    decodeFrames(SPIRAL_PAYLOAD_B64).then((decoded) => {
      if (cancelled) return;
      frames = decoded;
      // Paint frame 0 immediately so there's no flash of empty
      pre.textContent = frames[0] ?? "";

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          const wasInView = inView;
          inView = entry.isIntersecting;
          if (!wasInView && inView) {
            rafId = requestAnimationFrame(render);
          }
        },
        { threshold: 0 }
      );
      observer.observe(pre);

      rafId = requestAnimationFrame(render);

      return () => observer.disconnect();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <pre
      ref={preRef}
      aria-hidden="true"
      className={cn(
        // 80-column monospace block. leading-[1] keeps rows tight so the
        // disk shape stays close to its original terminal aspect.
        "select-none whitespace-pre font-mono leading-[1] text-cyan",
        // Light-mode glyph thickening (no-op in dark mode).
        "ascii-art-bright",
        // Glyph size is tiny on purpose—at 80 cols × 80 rows, even a
        // 6px glyph produces a ~480px-wide spiral. We size to fit comfortably
        // in the right half of the split hero (~520px column).
        "text-[3.5px] sm:text-[4.5px] md:text-[5px] lg:text-[5.5px] xl:text-[6px]",
        className
      )}
    />
  );
}
