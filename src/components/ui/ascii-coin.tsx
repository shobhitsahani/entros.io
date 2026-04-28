"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const COLS = 96;
const ROWS = 28;
const Y_CENTER_ROW = 14;
const X_SCALE = 40;
const Y_SCALE = 20;
const FRAME_INTERVAL_MS = 33;

const RADIUS = 1.4;
const THICKNESS = 0.10;
const FACE_R_STEP = 0.012;
const FACE_ANG_STEP_BASE = 0.045;
const SIDE_ANG_STEP = 0.012;
const SIDE_Z_STEP = 0.012;

const VIEWER_DISTANCE = 4.5;
const FOV = 1.6;

const ROT_SPEED = 1.05;

const LX = 0;
const LY = 0.7071067812;
const LZ = 0.7071067812;

const HX = 0;
const HY = 0.3826834324;
const HZ = 0.9238795325;

const LOGO_E: ReadonlyArray<ReadonlyArray<number>> = [
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
];
const LOGO_W = 7;
const LOGO_H = 9;
const LOGO_CELL = 0.24;
const LOGO_X_MIN = -(LOGO_W * LOGO_CELL) / 2;
const LOGO_Y_MAX = (LOGO_H * LOGO_CELL) / 2;
const ENGRAVE_FACTOR = 0.35;

interface AsciiCoinProps {
  className?: string;
}

export function AsciiCoin({ className }: AsciiCoinProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const tierBuffer = new Uint8Array(COLS * ROWS);
    const oozBuffer = new Float32Array(COLS * ROWS);

    let angle = 0;
    let rafId = 0;
    let lastFrame = 0;
    let prev = performance.now();
    let inView = true;

    function shadeAndPlot(
      idx: number,
      ooz: number,
      nxb: number,
      nyb: number,
      nzb: number,
      engrave: number
    ) {
      if (ooz <= oozBuffer[idx]!) return;
      oozBuffer[idx] = ooz;

      const diffuse = (nxb * LX + nyb * LY + nzb * LZ) * engrave;
      if (diffuse <= 0) {
        tierBuffer[idx] = 1;
        return;
      }
      const halfDot = nxb * HX + nyb * HY + nzb * HZ;
      let specular = 0;
      if (halfDot > 0) {
        const h2 = halfDot * halfDot;
        const h4 = h2 * h2;
        specular = h4 * h4 * engrave;
      }
      const lum = diffuse * 0.6 + specular * 0.95;
      let tier: number;
      if (lum >= 0.85) tier = 4;
      else if (lum >= 0.5) tier = 3;
      else if (lum >= 0.2) tier = 2;
      else tier = 1;
      tierBuffer[idx] = tier;
    }

    function render(now: number) {
      if (now - lastFrame < FRAME_INTERVAL_MS) {
        if (inView) rafId = requestAnimationFrame(render);
        return;
      }
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      lastFrame = now;

      angle += ROT_SPEED * dt;

      tierBuffer.fill(0);
      oozBuffer.fill(0);

      const cosY = Math.cos(angle);
      const sinY = Math.sin(angle);
      const TWO_PI = Math.PI * 2;

      for (let face = 0; face < 2; face++) {
        const faceZ = face === 0 ? THICKNESS : -THICKNESS;
        const normalZ = face === 0 ? 1 : -1;
        const nxb = normalZ * sinY;
        const nyb = 0;
        const nzb = normalZ * cosY;
        if (nzb < 0.05) continue;

        for (let r = 0; r <= RADIUS; r += FACE_R_STEP) {
          const angStep = FACE_ANG_STEP_BASE * (RADIUS / Math.max(r, 0.05));

          for (let a = 0; a < TWO_PI; a += angStep) {
            const xs = r * Math.cos(a);
            const ys = r * Math.sin(a);
            const xb = xs * cosY + faceZ * sinY;
            const yb = ys;
            const zb = -xs * sinY + faceZ * cosY;

            const distance = VIEWER_DISTANCE - zb;
            if (distance < 0.1) continue;
            const ooz = 1 / distance;

            const sx = xb * FOV * ooz;
            const sy = yb * FOV * ooz;
            const col = Math.round(COLS / 2 + sx * X_SCALE);
            const row = Math.round(Y_CENTER_ROW - sy * Y_SCALE);
            if (col < 0 || col >= COLS || row < 0 || row >= ROWS) continue;

            const bxRaw = Math.floor((xs - LOGO_X_MIN) / LOGO_CELL);
            const bx = face === 0 ? bxRaw : LOGO_W - 1 - bxRaw;
            const by = Math.floor((LOGO_Y_MAX - ys) / LOGO_CELL);
            let engrave = 1.0;
            if (
              bx >= 0 &&
              bx < LOGO_W &&
              by >= 0 &&
              by < LOGO_H &&
              LOGO_E[by]![bx] === 1
            ) {
              engrave = ENGRAVE_FACTOR;
            }

            shadeAndPlot(row * COLS + col, ooz, nxb, nyb, nzb, engrave);
          }
        }
      }

      for (let a = 0; a < TWO_PI; a += SIDE_ANG_STEP) {
        const cosA = Math.cos(a);
        const sinA = Math.sin(a);
        const nxb = cosA * cosY;
        const nyb = sinA;
        const nzb = -cosA * sinY;
        if (nzb < 0.12) continue;

        const xs = RADIUS * cosA;
        const ys = RADIUS * sinA;
        for (let z = -THICKNESS; z <= THICKNESS; z += SIDE_Z_STEP) {
          const xb = xs * cosY + z * sinY;
          const yb = ys;
          const zb = -xs * sinY + z * cosY;

          const distance = VIEWER_DISTANCE - zb;
          if (distance < 0.1) continue;
          const ooz = 1 / distance;

          const sx = xb * FOV * ooz;
          const sy = yb * FOV * ooz;
          const col = Math.round(COLS / 2 + sx * X_SCALE);
          const row = Math.round(Y_CENTER_ROW - sy * Y_SCALE);
          if (col < 0 || col >= COLS || row < 0 || row >= ROWS) continue;

          shadeAndPlot(row * COLS + col, ooz, nxb, nyb, nzb, 1.0);
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
