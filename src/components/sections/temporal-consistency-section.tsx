"use client";

import { useEffect, useRef, useState } from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";

const phases = [
  {
    day: "Day 1",
    title: "First verification",
    description:
      "You speak a phrase, trace a curve, move your device. The protocol captures the behavioral signature of that moment and stores a cryptographic commitment.",
  },
  {
    day: "Day 7",
    title: "Re-verification",
    description:
      "Same person, different session. Your voice shifts slightly. Your touch pressure changes. The ZK proof confirms the drift is within human range.",
  },
  {
    day: "Day 30+",
    title: "Trust compounds",
    description:
      "Each successful re-verification raises your Trust Score. Consistent patterns over weeks prove what a single snapshot cannot.",
  },
];

function DriftWaveform({ active }: { active: boolean }) {
  const points = 60;
  const width = 400;
  const height = 120;
  const mid = height / 2;

  function buildPath(
    phaseOffset: number,
    ampScale: number,
    freqScale: number
  ): string {
    const segments: string[] = [];
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const t = (i / points) * Math.PI * 4 * freqScale;
      const y =
        mid +
        Math.sin(t + phaseOffset) * 28 * ampScale +
        Math.sin(t * 2.3 + phaseOffset * 0.7) * 12 * ampScale;
      segments.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return segments.join(" ");
  }

  const prevPath = buildPath(0, 0.9, 1.0);
  const currPath = buildPath(0.4, 1.0, 1.02);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Two behavioral waveforms showing bounded drift between sessions"
    >
      {/* Bounded region hint */}
      <rect
        x="0"
        y={mid - 44}
        width={width}
        height={88}
        fill="rgba(0, 240, 255, 0.02)"
        rx="4"
      />

      {/* Previous session waveform */}
      <path
        d={prevPath}
        fill="none"
        stroke="rgba(0, 240, 255, 0.15)"
        strokeWidth="1.5"
        className="transition-opacity duration-1000"
        style={{ opacity: active ? 1 : 0 }}
      />

      {/* Current session waveform */}
      <path
        d={currPath}
        fill="none"
        stroke="rgba(0, 240, 255, 0.5)"
        strokeWidth="1.5"
        className="transition-opacity duration-1000 delay-300"
        style={{ opacity: active ? 1 : 0 }}
      >
        {active && (
          <animate
            attributeName="d"
            values={`${currPath};${buildPath(0.8, 1.05, 1.01)};${currPath}`}
            dur="8s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Labels */}
      <text
        x="0"
        y="14"
        className="fill-foreground/20"
        fontSize="9"
        fontFamily="var(--font-jetbrains)"
      >
        previous session
      </text>
      <text
        x="0"
        y={height - 6}
        className="fill-cyan/40"
        fontSize="9"
        fontFamily="var(--font-jetbrains)"
      >
        current session
      </text>

      {/* Threshold lines */}
      <line
        x1="0"
        y1={mid - 44}
        x2={width}
        y2={mid - 44}
        stroke="rgba(0, 240, 255, 0.06)"
        strokeDasharray="4 4"
      />
      <line
        x1="0"
        y1={mid + 44}
        x2={width}
        y2={mid + 44}
        stroke="rgba(0, 240, 255, 0.06)"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

export function TemporalConsistencySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// TEMPORAL CONSISTENCY"}
      </TextShimmer>

      <div className="mt-8 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-sans text-2xl font-semibold text-foreground md:text-3xl lg:text-4xl">
            Identity is not a moment.
            <br />
            It is a pattern.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-foreground/60">
            The protocol measures behavioral drift across sessions: small,
            involuntary changes in voice, motion, and touch that follow a
            bounded pattern unique to each person. Verify once to register.
            Verify again to prove you are still you. Each session strengthens
            the claim.
          </p>
        </div>

        <div className="relative">
          <DriftWaveform active={visible} />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {phases.map((phase) => (
          <GlowCard key={phase.day}>
            <span className="font-mono text-xs tracking-widest text-cyan uppercase">
              {phase.day}
            </span>
            <h3 className="mt-3 font-sans text-lg font-semibold text-foreground">
              {phase.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/60">
              {phase.description}
            </p>
          </GlowCard>
        ))}
      </div>
    </section>
  );
}
