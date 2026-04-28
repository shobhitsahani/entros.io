"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const COLS = 96;
const ROWS = 28;
const Y_CENTER_ROW = 14;
const X_SCALE = 40;
const Y_SCALE = 20;
const FRAME_INTERVAL_MS = 33;

const R = 1.0;
const MINOR_R = 0.55;
const THETA_STEP = 0.05;
const PHI_STEP = 0.012;

const VIEWER_DISTANCE = 4.5;
const FOV = 1.6;

const ROT_A_SPEED = 0.42;
const ROT_B_SPEED = 0.21;

const LX = 0;
const LY = 0.7071067812;
const LZ = 0.7071067812;

const HX = 0;
const HY = 0.3826834324;
const HZ = 0.9238795325;

interface AsciiTorusProps {
  className?: string;
}

export function AsciiTorus({ className }: AsciiTorusProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const tierBuffer = new Uint8Array(COLS * ROWS);
    const oozBuffer = new Float32Array(COLS * ROWS);

    let angleA = 0;
    let angleB = 0;
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

      angleA += ROT_A_SPEED * dt;
      angleB += ROT_B_SPEED * dt;

      tierBuffer.fill(0);
      oozBuffer.fill(0);

      const cosA = Math.cos(angleA);
      const sinA = Math.sin(angleA);
      const cosB = Math.cos(angleB);
      const sinB = Math.sin(angleB);
      const TWO_PI = Math.PI * 2;

      for (let theta = 0; theta < TWO_PI; theta += THETA_STEP) {
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        for (let phi = 0; phi < TWO_PI; phi += PHI_STEP) {
          const cosPhi = Math.cos(phi);
          const sinPhi = Math.sin(phi);

          const Rmcp = R + MINOR_R * cosPhi;
          const xs = Rmcp * cosTheta;
          const ys = Rmcp * sinTheta;
          const zs = MINOR_R * sinPhi;

          const nxs = cosPhi * cosTheta;
          const nys = cosPhi * sinTheta;
          const nzs = sinPhi;

          const ya = ys * cosA - zs * sinA;
          const za = ys * sinA + zs * cosA;
          const nya = nys * cosA - nzs * sinA;
          const nza = nys * sinA + nzs * cosA;

          const xb = xs * cosB - ya * sinB;
          const yb = xs * sinB + ya * cosB;
          const zb = za;
          const nxb = nxs * cosB - nya * sinB;
          const nyb = nxs * sinB + nya * cosB;
          const nzb = nza;

          if (nzb < 0) continue;

          const distance = VIEWER_DISTANCE - zb;
          if (distance < 0.1) continue;
          const ooz = 1 / distance;

          const sx = xb * FOV * ooz;
          const sy = yb * FOV * ooz;
          const col = Math.round(COLS / 2 + sx * X_SCALE);
          const row = Math.round(Y_CENTER_ROW - sy * Y_SCALE);
          if (col < 0 || col >= COLS || row < 0 || row >= ROWS) continue;

          const idx = row * COLS + col;
          if (ooz <= oozBuffer[idx]!) continue;
          oozBuffer[idx] = ooz;

          const diffuse = nxb * LX + nyb * LY + nzb * LZ;
          if (diffuse <= 0) {
            tierBuffer[idx] = 1;
            continue;
          }
          const halfDot = nxb * HX + nyb * HY + nzb * HZ;
          let specular = 0;
          if (halfDot > 0) {
            const h2 = halfDot * halfDot;
            const h4 = h2 * h2;
            specular = h4 * h4;
          }
          const lum = diffuse * 0.6 + specular * 0.95;
          let tier: number;
          if (lum >= 0.85) tier = 4;
          else if (lum >= 0.5) tier = 3;
          else if (lum >= 0.2) tier = 2;
          else tier = 1;
          tierBuffer[idx] = tier;
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
