"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const SQUARE_SIZE = 4;
const GRID_GAP = 6;
const FLICKER_CHANCE = 0.3;
const OPACITY_BUCKETS = 32;
const MOBILE_FRAME_INTERVAL = 120; // ~8fps cap on mobile (vs 60fps desktop) — slow enough to avoid compositor contention during scroll

function buildPalette(maxOpacity: number): string[] {
  const isDark = document.documentElement.classList.contains("dark");
  const [r, g, b] = isDark ? [232, 230, 224] : [26, 26, 31];
  const styles: string[] = new Array(OPACITY_BUCKETS);
  for (let i = 0; i < OPACITY_BUCKETS; i++) {
    const a = (i / (OPACITY_BUCKETS - 1)) * maxOpacity;
    styles[i] = `rgba(${r},${g},${b},${a})`;
  }
  return styles;
}

function getMaxOpacity(): number {
  return document.documentElement.classList.contains("dark") ? 0.35 : 0.2;
}

export function FallingPattern({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let inView = false;
    let lastTime = 0;
    let maxOp = getMaxOpacity();
    let palette = buildPalette(maxOp);

    // Grid state
    let cols = 0;
    let rows = 0;
    let squares: Uint8Array = new Uint8Array(0);
    let dpr = 1;

    const setup = () => {
      dpr = window.devicePixelRatio || 1;
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const step = SQUARE_SIZE + GRID_GAP;
      cols = Math.floor(width / step);
      rows = Math.floor(height / step);
      squares = new Uint8Array(cols * rows);

      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.floor(Math.random() * OPACITY_BUCKETS);
      }
    };

    // Pre-allocate bucket index arrays (reused every frame)
    const bucketIndices: number[][] = new Array(OPACITY_BUCKETS);
    for (let b = 0; b < OPACITY_BUCKETS; b++) {
      bucketIndices[b] = [];
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Honour reduced-motion preference: render one static frame and stop.
    if (prefersReducedMotion) {
      setup();
      const step = (SQUARE_SIZE + GRID_GAP) * dpr;
      const size = SQUARE_SIZE * dpr;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let b = 0; b < OPACITY_BUCKETS; b++) {
        const indices: number[] = [];
        for (let i = 0; i < cols * rows; i++) {
          if (squares[i] === b) indices.push(i);
        }
        if (indices.length === 0) continue;
        ctx.fillStyle = palette[b]!;
        ctx.beginPath();
        for (const idx of indices) {
          const col = (idx / rows) | 0;
          const row = idx - col * rows;
          ctx.rect(col * step, row * step, size, size);
        }
        ctx.fill();
      }
      return;
    }

    const animate = (time: number) => {
      if (!inView) return;

      // Throttle aggressively on mobile so the rAF loop does not compete
      // with the scroll compositor. Desktop runs at the browser's native rate.
      if (isMobile && time - lastTime < MOBILE_FRAME_INTERVAL) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const flickerThreshold = FLICKER_CHANCE * deltaTime;
      const total = cols * rows;

      // Update flickering squares (Uint8 bucket indices, no float math)
      for (let i = 0; i < total; i++) {
        if (Math.random() < flickerThreshold) {
          squares[i] = Math.floor(Math.random() * OPACITY_BUCKETS);
        }
      }

      // Sort dots into opacity buckets
      for (let b = 0; b < OPACITY_BUCKETS; b++) {
        bucketIndices[b]!.length = 0;
      }
      for (let i = 0; i < total; i++) {
        bucketIndices[squares[i]!]!.push(i);
      }

      // Draw: one fillStyle + one batched fill() per bucket
      const step = (SQUARE_SIZE + GRID_GAP) * dpr;
      const size = SQUARE_SIZE * dpr;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let b = 0; b < OPACITY_BUCKETS; b++) {
        const indices = bucketIndices[b]!;
        if (indices.length === 0) continue;

        ctx.fillStyle = palette[b]!;
        ctx.beginPath();
        for (let k = 0; k < indices.length; k++) {
          const idx = indices[k]!;
          const col = (idx / rows) | 0;
          const row = idx - col * rows;
          ctx.rect(col * step, row * step, size, size);
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    setup();

    let lastWidth = container.getBoundingClientRect().width;
    const resizeObserver = new ResizeObserver(() => {
      // Only re-setup on width changes. Height-only changes come from
      // mobile browser chrome hiding/showing and cause scroll stutter.
      const currentWidth = container.getBoundingClientRect().width;
      if (Math.abs(currentWidth - lastWidth) < 1) return;
      lastWidth = currentWidth;
      setup();
      if (inView) {
        lastTime = performance.now();
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(animate);
      }
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const wasInView = inView;
        inView = entry.isIntersecting;
        if (!wasInView && inView) {
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      maxOp = getMaxOpacity();
      palette = buildPalette(maxOp);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      <div className="hero-glow" />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
