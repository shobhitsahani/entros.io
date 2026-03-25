import Link from "next/link";
import { SpecialText } from "@/components/ui/special-text";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { FallingPattern } from "@/components/ui/falling-pattern";
import { GlassPanel } from "@/components/ui/glass-panel";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 pt-24 pb-20">
      <div className="pointer-events-none absolute inset-0 bottom-[-40%] overflow-hidden">
        <FallingPattern
          className="h-full [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="text-glow-cyan font-mono text-3xl font-bold tracking-[0.02em] md:text-6xl lg:text-7xl overflow-hidden">
          <SpecialText inView speed={30} className="text-3xl md:text-6xl lg:text-7xl">
            Prove you&apos;re human,
          </SpecialText>
          <br />
          <SpecialText inView speed={30} delay={1.5} className="text-3xl md:text-6xl lg:text-7xl">
            not who you are.
          </SpecialText>
        </h1>

        <GlassPanel className="mx-auto mt-10 max-w-2xl rounded-2xl px-8 py-6">
          <p className="text-base text-foreground/80 leading-relaxed md:text-lg">
            Voice, motion, and touch. Hashed into a ZK proof on
            your device. Raw biometric data never leaves. Trust that
            grows with every verification. Verified on Solana.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/verify">
              <ShimmerButton className="text-sm font-medium lg:text-base">
                <span className="flex items-center gap-2">
                  Try the Demo
                  <span aria-hidden="true">→</span>
                </span>
              </ShimmerButton>
            </Link>
            <a
              href="/paper"
              className="rounded-full border border-foreground/20 bg-foreground/5 px-6 py-3 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:border-foreground/40 hover:bg-foreground/10 hover:text-foreground"
            >
              Read the Paper
            </a>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
