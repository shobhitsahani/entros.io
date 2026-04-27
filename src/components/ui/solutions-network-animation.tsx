// @ts-nocheck
// animation math with guaranteed-bounds array access
"use client";

import { useRef, useEffect } from "react";

/**
 * Radial trust network for the /solutions page.
 * Central verified node with outward pulse signals to protocol nodes.
 * Represents one human identity connecting to many protocols.
 * Pure SVG, requestAnimationFrame loop.
 */

const VB = 500;
const CX = VB / 2;
const CY = VB / 2;
const FOV = 600;

const INNER_RADIUS = 55;
const OUTER_RADIUS = 155;
const NODE_COUNT = 6;
const ROTATION_SPEED = 0.03;
const VIEW_TILT = 0.45;
const FADE_IN_DURATION = 1.5;

// Pulse from center outward
const PULSE_INTERVAL = 2.5;
const PULSE_TRAVEL = 1.2; // seconds to reach outer ring
const PULSE_WIDTH = 0.15; // fraction of the path

// Outer nodes orbit slightly
const ORBIT_AMP = 0.03;
const ORBIT_SPEED = 0.4;

interface Pt { x: number; y: number; z: number; s: number }

function rotY(x: number, y: number, z: number, a: number): [number, number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}

function rotX(x: number, y: number, z: number, a: number): [number, number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}

function proj(x: number, y: number, z: number): Pt {
  const scale = FOV / (FOV + z);
  return { x: CX + x * scale, y: CY + y * scale, z, s: scale };
}

export function SolutionsNetworkAnimation({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let raf = 0;
    const t0 = performance.now();
    let prev = t0;
    let angle = 0;
    let pulseTimer = 1;
    const pulses: number[] = [];

    const rawCyan = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-cyan").trim();
    const cyanRGB = rawCyan.startsWith("#")
      ? `${parseInt(rawCyan.slice(1, 3), 16)}, ${parseInt(rawCyan.slice(3, 5), 16)}, ${parseInt(rawCyan.slice(5, 7), 16)}`
      : "34, 211, 230";

    let oBoost = document.documentElement.classList.contains("dark") ? 1 : 2.5;
    const observer = new MutationObserver(() => {
      oBoost = document.documentElement.classList.contains("dark") ? 1 : 2.5;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Precompute node base positions on XZ plane
    const nodeAngles: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodeAngles.push((i / NODE_COUNT) * Math.PI * 2);
    }

    function tick(now: number) {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      const elapsed = (now - t0) / 1000;
      const fade = Math.min(elapsed / FADE_IN_DURATION, 1);
      const t = elapsed;

      angle += ROTATION_SPEED * dt;

      // Pulse management
      pulseTimer -= dt;
      if (pulseTimer <= 0) {
        pulses.push(t);
        pulseTimer = PULSE_INTERVAL;
      }
      while (pulses.length > 0 && t - pulses[0] > PULSE_TRAVEL) {
        pulses.shift();
      }

      // Transform center
      let cx = 0, cy = 0, cz = 0;
      [cx, cy, cz] = rotY(cx, cy, cz, angle);
      [cx, cy, cz] = rotX(cx, cy, cz, VIEW_TILT);
      const center = proj(cx, cy, cz);

      // Transform outer nodes
      const outerNodes: Pt[] = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        const a = nodeAngles[i];
        const orbitOffset = Math.sin(t * ORBIT_SPEED + i * 2.1) * ORBIT_AMP;
        const r = OUTER_RADIUS * (1 + orbitOffset);

        let x = Math.cos(a) * r;
        let y = 0;
        let z = Math.sin(a) * r;

        [x, y, z] = rotY(x, y, z, angle);
        [x, y, z] = rotX(x, y, z, VIEW_TILT);

        outerNodes.push(proj(x, y, z));
      }

      // Transform inner ring nodes (subtle structural ring)
      const innerNodes: Pt[] = [];
      const innerCount = 12;
      for (let i = 0; i < innerCount; i++) {
        const a = (i / innerCount) * Math.PI * 2;
        let x = Math.cos(a) * INNER_RADIUS;
        let y = 0;
        let z = Math.sin(a) * INNER_RADIUS;

        [x, y, z] = rotY(x, y, z, angle);
        [x, y, z] = rotX(x, y, z, VIEW_TILT);

        innerNodes.push(proj(x, y, z));
      }

      const parts: { z: number; svg: string }[] = [];

      // Inner ring (subtle structure)
      for (let i = 0; i < innerCount; i++) {
        const a = innerNodes[i];
        const b = innerNodes[(i + 1) % innerCount];
        const depth = ((a.z + b.z) / 2 + OUTER_RADIUS) / (OUTER_RADIUS * 2);
        const o = Math.min((0.04 + 0.08 * depth) * fade * oBoost, 0.4);
        parts.push({
          z: (a.z + b.z) / 2,
          svg: `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="rgba(${cyanRGB},${o})" stroke-width="0.5"/>`,
        });
      }

      // Connection lines: center to each outer node
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = outerNodes[i];
        const depth = (n.z + OUTER_RADIUS) / (OUTER_RADIUS * 2);
        const o = Math.min((0.06 + 0.1 * depth) * fade * oBoost, 0.5);
        parts.push({
          z: (center.z + n.z) / 2,
          svg: `<line x1="${center.x}" y1="${center.y}" x2="${n.x}" y2="${n.y}" stroke="rgba(${cyanRGB},${o})" stroke-width="0.6"/>`,
        });
      }

      // Cross-connections between adjacent outer nodes
      for (let i = 0; i < NODE_COUNT; i++) {
        const a = outerNodes[i];
        const b = outerNodes[(i + 1) % NODE_COUNT];
        const depth = ((a.z + b.z) / 2 + OUTER_RADIUS) / (OUTER_RADIUS * 2);
        const o = Math.min((0.03 + 0.06 * depth) * fade * oBoost, 0.3);
        parts.push({
          z: (a.z + b.z) / 2,
          svg: `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="rgba(${cyanRGB},${o})" stroke-width="0.4"/>`,
        });
      }

      // Pulse signals traveling outward along connection lines
      for (const pStart of pulses) {
        const progress = (t - pStart) / PULSE_TRAVEL;
        if (progress < 0 || progress > 1) continue;

        for (let i = 0; i < NODE_COUNT; i++) {
          const n = outerNodes[i];
          const px = center.x + (n.x - center.x) * progress;
          const py = center.y + (n.y - center.y) * progress;
          const pz = center.z + (n.z - center.z) * progress;

          const pulseO = Math.min((0.6 * (1 - Math.abs(progress - 0.5) * 2)) * fade * oBoost, 1);
          const pulseR = 3 + progress * 1.5;

          parts.push({
            z: pz + 0.01,
            svg:
              `<circle cx="${px}" cy="${py}" r="${pulseR * 3}" fill="rgba(${cyanRGB},${pulseO * 0.1})"/>` +
              `<circle cx="${px}" cy="${py}" r="${pulseR}" fill="rgba(${cyanRGB},${pulseO})"/>`,
          });
        }
      }

      // Outer nodes
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = outerNodes[i];
        const depth = (n.z + OUTER_RADIUS) / (OUTER_RADIUS * 2);
        const r = 3 + depth * 2;
        const o = Math.min((0.3 + 0.5 * depth) * fade * oBoost, 1);

        // Check if any pulse is arriving
        let arriving = 0;
        for (const pStart of pulses) {
          const progress = (t - pStart) / PULSE_TRAVEL;
          if (progress > 0.85 && progress < 1.05) {
            arriving = Math.max(arriving, 1 - Math.abs(progress - 0.95) * 10);
          }
        }

        const glowR = r * 3 + arriving * 8;
        const glowO = Math.min((o * 0.1 + arriving * 0.15) * oBoost, 0.5);

        parts.push({
          z: n.z,
          svg:
            `<circle cx="${n.x}" cy="${n.y}" r="${glowR}" fill="rgba(${cyanRGB},${glowO})"/>` +
            `<circle cx="${n.x}" cy="${n.y}" r="${r + arriving * 2}" fill="rgba(${cyanRGB},${o})"/>`,
        });
      }

      // Center node (slightly larger, represents the human)
      const centerO = Math.min(0.7 * fade * oBoost, 1);
      const centerPulse = 1 + 0.1 * Math.sin(t * 1.5);
      parts.push({
        z: center.z + 0.02,
        svg:
          `<circle cx="${center.x}" cy="${center.y}" r="${12 * centerPulse}" fill="rgba(${cyanRGB},${Math.min(0.05 * oBoost, 0.2)})"/>` +
          `<circle cx="${center.x}" cy="${center.y}" r="${5 * centerPulse}" fill="rgba(${cyanRGB},${centerO * 0.5})"/>` +
          `<circle cx="${center.x}" cy="${center.y}" r="${3 * centerPulse}" fill="rgba(${cyanRGB},${centerO})"/>`,
      });

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
