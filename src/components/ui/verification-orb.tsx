"use client";

import { useEffect, useRef } from "react";

// Icosahedron geometry — 12 vertices, 30 edges
const PHI = (1 + Math.sqrt(5)) / 2;
const RAW_VERTS: [number, number, number][] = [
  [0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI],
  [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1],
];
// Normalize to unit sphere
const VERTS = RAW_VERTS.map(([x, y, z]) => {
  const len = Math.sqrt(x * x + y * y + z * z);
  return [x / len, y / len, z / len] as [number, number, number];
});
// Edges: connect vertices within distance threshold
const EDGES: [number, number][] = [];
const edgeThreshold = 2.2 / Math.sqrt(1 + PHI * PHI);
for (let i = 0; i < VERTS.length; i++) {
  for (let j = i + 1; j < VERTS.length; j++) {
    const dx = VERTS[i]![0] - VERTS[j]![0];
    const dy = VERTS[i]![1] - VERTS[j]![1];
    const dz = VERTS[i]![2] - VERTS[j]![2];
    if (Math.sqrt(dx * dx + dy * dy + dz * dz) < edgeThreshold) {
      EDGES.push([i, j]);
    }
  }
}

function rotateY(v: [number, number, number], a: number): [number, number, number] {
  const cos = Math.cos(a), sin = Math.sin(a);
  return [v[0] * cos + v[2] * sin, v[1], -v[0] * sin + v[2] * cos];
}

function rotateX(v: [number, number, number], a: number): [number, number, number] {
  const cos = Math.cos(a), sin = Math.sin(a);
  return [v[0], v[1] * cos - v[2] * sin, v[1] * sin + v[2] * cos];
}

export function VerificationOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    const size = 180;
    const scale = size * 0.3;
    const center = size / 2;
    const focalLength = 3.5;

    // Read theme-aware cyan color from CSS variable
    const rawCyan = getComputedStyle(document.documentElement).getPropertyValue("--color-cyan").trim();
    const cyanRGB = rawCyan.startsWith("#")
      ? `${parseInt(rawCyan.slice(1, 3), 16)}, ${parseInt(rawCyan.slice(3, 5), 16)}, ${parseInt(rawCyan.slice(5, 7), 16)}`
      : "0, 240, 255";

    // Set canvas resolution for crisp rendering
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // Pre-create soul orb gradient (constant — avoid allocating per frame)
    const soulGlow = ctx.createRadialGradient(center, center, 0, center, center, 12);
    soulGlow.addColorStop(0, `rgba(${cyanRGB}, 0.35)`);
    soulGlow.addColorStop(0.4, `rgba(${cyanRGB}, 0.08)`);
    soulGlow.addColorStop(1, `rgba(${cyanRGB}, 0)`);

    function project(v: [number, number, number]): [number, number, number] {
      const perspective = focalLength / (focalLength + v[2]);
      return [
        center + v[0] * scale * perspective,
        center + v[1] * scale * perspective,
        perspective,
      ];
    }

    function draw(time: number) {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, size, size);

      const ay = time * 0.0003;
      const ax = time * 0.00012;

      // Transform vertices
      const projected = VERTS.map((v) => {
        const r1 = rotateY(v, ay);
        const r2 = rotateX(r1, ax);
        return project(r2);
      });

      // Draw edges with depth-based opacity
      for (const [i, j] of EDGES) {
        const a = projected[i]!;
        const b = projected[j]!;
        const avgDepth = (a[2] + b[2]) / 2;
        const opacity = 0.08 + avgDepth * 0.18;

        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.strokeStyle = `rgba(${cyanRGB}, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Soul orb — steady glowing core
      ctx.beginPath();
      ctx.arc(center, center, 12, 0, Math.PI * 2);
      ctx.fillStyle = soulGlow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(center, center, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cyanRGB}, 0.7)`;
      ctx.fill();

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="mx-auto flex justify-center -mt-10 -mb-10">
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
