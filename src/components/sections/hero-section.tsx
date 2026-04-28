import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AsciiSpiral } from "@/components/ui/ascii-spiral";

/**
 * Homepage hero—split layout.
 * Left:  display headline · subheading · two CTAs.
 * Right: ASCII spiral animation.
 */
export function HeroSection() {
  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-28 pb-6 md:pt-36 md:pb-12 lg:min-h-[calc(100vh-4rem)] lg:flex-row lg:items-center lg:gap-12 lg:pt-24 lg:pb-24">
      {/* Left column—copy + CTAs */}
      <div className="relative z-10 flex flex-col lg:w-1/2 lg:max-w-2xl">
        <h1 className="font-display text-5xl font-medium leading-[1.02] tracking-[-0.02em] text-foreground md:text-6xl lg:text-7xl">
          The temporal
          <br />
          identity layer
          <span className="text-cyan">.</span>
        </h1>

        <p className="mt-7 max-w-xl text-base leading-relaxed text-foreground/70 md:mt-8 md:text-lg">
          Proof of personhood for Solana, verified through behavior over
          time. Runs entirely on your device, portable across every dApp.
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {/* Primary CTA—solid filled, cyan label */}
          <Link
            href="/verify"
            className="
              group inline-flex items-center justify-center gap-2
              rounded-full bg-foreground px-6 py-3
              text-sm font-medium text-background
              transition-colors hover:bg-foreground/90
            "
          >
            Try the Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Secondary CTA—outlined, neutral label */}
          <Link
            href="/integrate"
            className="
              group inline-flex items-center justify-center gap-2
              rounded-full border border-foreground/20 px-6 py-3
              text-sm font-medium text-foreground
              transition-colors hover:border-foreground/40 hover:bg-foreground/5
            "
          >
            Build with Entros
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Right column—ASCII spiral. flex justify-center makes the pre
          (a flex item with content-driven width) sit centered in the column
          on every breakpoint.

          Explicit min-height matches the spiral's eventual rendered height
          at each breakpoint (80 rows × font-size: 80×3.5px=280, 80×4.5px=360,
          80×5px=400, 80×5.5px=440, 80×6px=480). This reserves the layout
          space before the async payload decodes, eliminating the CLS that
          would otherwise shove the headline upward on first paint. */}
      <div className="relative flex h-[280px] flex-1 items-center justify-center sm:h-[360px] md:h-[400px] lg:h-[440px] lg:w-1/2 xl:h-[480px]">
        <AsciiSpiral className="opacity-95" />
      </div>
    </section>
  );
}
