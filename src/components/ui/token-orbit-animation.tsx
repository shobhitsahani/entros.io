// @ts-nocheck — animation math with guaranteed-bounds array access
"use client";

import { useRef, useEffect } from "react";

/**
 * Token galaxy animation for the /token page.
 * Multiple orbital rings at slight tilts forming a galactic disk.
 * Flowing particles with glow trails. No central orb.
 * Pure SVG, requestAnimationFrame loop.
 */

const VB = 500;
const CX = VB / 2;
const CY = VB / 2;
const FOV = 600;
const BASE_RADIUS = 150;

// Fixed viewing angle — looking from above at ~30°
// Prevents rings from ever collapsing to a line
const VIEW_TILT = 0.5;

const RING_SEGMENTS = 80;
const ROTATION_SPEED = 0.06;
const FADE_IN_DURATION = 1.5;

// Rings at slightly different tilts and radii — galaxy disk
const RINGS = [
  { radius: 0.65, tiltX: 0.08, tiltZ: 0, particles: 3, speed: 0.15 },
  { radius: 0.82, tiltX: -0.06, tiltZ: 0.9, particles: 3, speed: -0.10 },
  { radius: 1.0, tiltX: 0.12, tiltZ: 1.8, particles: 4, speed: 0.08 },
  { radius: 1.18, tiltX: -0.1, tiltZ: 2.7, particles: 3, speed: -0.12 },
];

// No ambient dust — clean structure only

interface Pt { x: number; y: number; z: number }

function rotY(x: number, y: number, z: number, a: number): [number, number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}

function rotX(x: number, y: number, z: number, a: number): [number, number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}

function rotZ(x: number, y: number, z: number, a: number): [number, number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c - y * s, x * s + y * c, z];
}

function proj(x: number, y: number, z: number): Pt {
  const s = FOV / (FOV + z * BASE_RADIUS);
  return { x: CX + x * BASE_RADIUS * s, y: CY + y * BASE_RADIUS * s, z };
}

export function TokenOrbitAnimation({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let raf = 0;
    const t0 = performance.now();
    let prev = t0;
    let angle = 0;

    const rawCyan = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-cyan").trim();
    const cyanRGB = rawCyan.startsWith("#")
      ? `${parseInt(rawCyan.slice(1, 3), 16)}, ${parseInt(rawCyan.slice(3, 5), 16)}, ${parseInt(rawCyan.slice(5, 7), 16)}`
      : "34, 211, 230";

    // Light mode needs higher opacity — cyan on white is faint
    let oBoost = document.documentElement.classList.contains("dark") ? 1 : 2.5;
    const observer = new MutationObserver(() => {
      oBoost = document.documentElement.classList.contains("dark") ? 1 : 2.5;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Precompute unit circle
    const circle: [number, number][] = [];
    for (let i = 0; i < RING_SEGMENTS; i++) {
      const th = (i / RING_SEGMENTS) * Math.PI * 2;
      circle.push([Math.cos(th), Math.sin(th)]);
    }

    function tick(now: number) {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      const elapsed = (now - t0) / 1000;
      const fade = Math.min(elapsed / FADE_IN_DURATION, 1);
      const t = elapsed;

      angle += ROTATION_SPEED * dt;

      const parts: { z: number; svg: string }[] = [];

      // --- Orbital rings ---
      for (const ring of RINGS) {
        const pts: Pt[] = [];
        const R = ring.radius;

        for (let i = 0; i < RING_SEGMENTS; i++) {
          let x = circle[i][0] * R;
          let y = 0;
          let z = circle[i][1] * R;

          // Slight tilt per ring (keeps it near-horizontal)
          [x, y, z] = rotX(x, y, z, ring.tiltX);
          [x, y, z] = rotZ(x, y, z, ring.tiltZ);

          // Global rotation + fixed view angle
          [x, y, z] = rotY(x, y, z, angle);
          [x, y, z] = rotX(x, y, z, VIEW_TILT);

          pts.push(proj(x, y, z));
        }

        // Ring lines — very subtle
        for (let i = 0; i < RING_SEGMENTS; i++) {
          const a = pts[i];
          const b = pts[(i + 1) % RING_SEGMENTS];
          const avgZ = (a.z + b.z) / 2;
          const depth = (avgZ + 1.3) / 2.6;
          const o = Math.min((0.08 + 0.14 * depth) * fade * oBoost, 0.6);

          parts.push({
            z: avgZ,
            svg: `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="rgba(${cyanRGB},${o})" stroke-width="0.5"/>`,
          });
        }

        // Flowing particles with trail
        for (let p = 0; p < ring.particles; p++) {
          const phase = (((t * ring.speed + p / ring.particles) % 1) + 1) % 1;

          // Trail: 3 dots at decreasing opacity
          for (let tr = 0; tr < 3; tr++) {
            const trailPhase = (((phase - tr * 0.012) % 1) + 1) % 1;
            const idx = trailPhase * RING_SEGMENTS;
            const iA = Math.floor(idx) % RING_SEGMENTS;
            const iB = (iA + 1) % RING_SEGMENTS;
            const f = idx - Math.floor(idx);

            const pA = pts[iA];
            const pB = pts[iB];
            const px = pA.x + (pB.x - pA.x) * f;
            const py = pA.y + (pB.y - pA.y) * f;
            const pz = pA.z + (pB.z - pA.z) * f;

            const depth = (pz + 1.3) / 2.6;
            const trailFade = 1 - tr * 0.35;
            const r = (2 + depth * 1.5) * trailFade;
            const o = Math.min((0.3 + 0.5 * depth) * trailFade * fade * oBoost, 1);

            if (tr === 0) {
              // Lead particle glow
              const glowO = o * 0.12 * oBoost;
              parts.push({
                z: pz + 0.001,
                svg: `<circle cx="${px}" cy="${py}" r="${r * 3.5}" fill="rgba(${cyanRGB},${glowO})"/>`,
              });
            }

            parts.push({
              z: pz + 0.002 - tr * 0.0001,
              svg: `<circle cx="${px}" cy="${py}" r="${r}" fill="rgba(${cyanRGB},${o})"/>`,
            });
          }
        }
      }

      // Sort back to front
      parts.sort((a, b) => a.z - b.z);

      let html = "";
      for (const p of parts) html += p.svg;

      svg.innerHTML = html;
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="70 80 360 340"
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    />
  );
}
