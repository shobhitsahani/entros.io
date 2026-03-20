"use client";

import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

function GlassDistortionFilter() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter
          id="glass-distortion"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.02"
            numOctaves={2}
            seed={3}
            result="turbulence"
          />
          <feGaussianBlur
            in="turbulence"
            stdDeviation={4}
            result="blurredNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale={18}
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur
            in="displaced"
            stdDeviation={0.5}
            result="finalBlur"
          />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div className={cn("relative", className)}>
      <GlassDistortionFilter />

      {/* Frosted refraction — heavy blur + saturation so background bleeds through */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
        style={{
          backdropFilter:
            'url("#glass-distortion") blur(8px) saturate(1.8) brightness(1.05)',
          WebkitBackdropFilter:
            'url("#glass-distortion") blur(8px) saturate(1.8) brightness(1.05)',
        }}
      />

      {/* Ultra-thin tint — barely visible, lets background color through */}
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-[inherit]",
          "bg-background/5 dark:bg-background/8"
        )}
      />

      {/* Top specular highlight — light catching the upper curved surface */}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[60%] rounded-t-[inherit]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, transparent 100%)",
        }}
      />

      {/* Dark mode: dimmer top highlight */}
      <div
        className="absolute inset-x-0 top-0 -z-10 hidden h-[60%] rounded-t-[inherit] dark:block"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, transparent 100%)",
        }}
      />

      {/* Bottom inner shadow — gives depth, liquid pooling effect */}
      <div
        className="absolute inset-0 -z-10 rounded-[inherit]"
        style={{
          boxShadow: [
            // Outer glow
            "0 8px 32px rgba(0,0,0,0.06)",
            "0 2px 8px rgba(0,0,0,0.04)",
            // Inner edge highlights — simulates curved glass surface
            "inset 0 1px 0 rgba(255,255,255,0.35)",
            "inset 0 -1px 0 rgba(0,0,0,0.05)",
            // Lateral edge catches
            "inset 1px 0 0 rgba(255,255,255,0.12)",
            "inset -1px 0 0 rgba(255,255,255,0.12)",
          ].join(", "),
        }}
      />

      {/* Dark mode shadow overrides */}
      <div
        className="absolute inset-0 -z-10 hidden rounded-[inherit] dark:block"
        style={{
          boxShadow: [
            "0 8px 32px rgba(0,0,0,0.3)",
            "0 2px 8px rgba(0,0,0,0.2)",
            "inset 0 1px 0 rgba(255,255,255,0.12)",
            "inset 0 -1px 0 rgba(0,0,0,0.2)",
            "inset 1px 0 0 rgba(255,255,255,0.06)",
            "inset -1px 0 0 rgba(255,255,255,0.06)",
          ].join(", "),
        }}
      />

      {/* Border — gradient that fades, not a solid line */}
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-[inherit]",
          "border border-white/20 dark:border-white/[0.08]"
        )}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
