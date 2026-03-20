/**
 * Hero variant: Ethereal Shadows
 *
 * Background: SVG turbulence filter with animated hue rotation (cyan tint).
 * Extends 40% below the hero for smooth bleed into the next section.
 * Throttled to ~15fps for performance.
 *
 * Required UI component: src/components/ui/ethereal-shadow.tsx
 *
 * To activate: copy this file's content into src/components/sections/hero-section.tsx
 */

import Link from "next/link";
import { SpecialText } from "@/components/ui/special-text";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { EtherealShadow } from "@/components/ui/ethereal-shadow";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 pt-24 pb-20">
      {/* Ethereal background — extends 40% below the hero for bleed into next section */}
      <div className="pointer-events-none absolute inset-0 bottom-[-40%] overflow-hidden">
        <EtherealShadow
          color="rgba(0, 240, 255, 0.18)"
          animation={{ scale: 60, speed: 70 }}
          noise={{ opacity: 0.3, scale: 1 }}
          sizing="fill"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="text-glow-cyan font-mono text-4xl font-bold tracking-[0.02em] md:text-6xl lg:text-7xl">
          <SpecialText inView speed={30} className="text-4xl md:text-6xl lg:text-7xl">
            PROVE YOU&apos;RE HUMAN,
          </SpecialText>
          <br />
          <SpecialText inView speed={30} delay={1.5} className="text-4xl md:text-6xl lg:text-7xl">
            NOT WHO YOU ARE.
          </SpecialText>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted leading-relaxed">
          The IAM Protocol verifies liveness through behavioral
          dynamics — voice prosody, hand tremor, touch patterns. Built on
          Solana. Privacy by architecture.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/verify">
            <ShimmerButton className="text-sm font-medium lg:text-base">
              <span className="flex items-center gap-2">
                Try the Demo
                <span aria-hidden="true">→</span>
              </span>
            </ShimmerButton>
          </Link>
          <a
            href="/technology"
            className="rounded-full border border-border px-6 py-3 text-sm text-muted transition-all duration-200 hover:border-border-hover hover:text-foreground"
          >
            Read the Paper
          </a>
        </div>
      </div>
    </section>
  );
}
