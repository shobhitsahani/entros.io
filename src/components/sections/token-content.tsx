import Link from "next/link";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  Coins,
  Shield,
  Vote,
  Layers,
  Rocket,
  TrendingUp,
  Lock,
} from "lucide-react";
import {
  protocolFee,
  flywheel,
  tokenDistribution,
  tokenUtilities,
  launchDetails,
} from "@/data/token-economics";

export function TokenContent() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24">
      {/* Protocol Fee */}
      <section className="mt-16">
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// PROTOCOL FEE"}
        </TextShimmer>

        <h2 className="mt-4 font-mono text-xl font-bold text-foreground md:text-2xl">
          Every verification generates protocol revenue.
        </h2>

        <GlowCard className="mt-6">
          <div className="flex items-start gap-4">
            <Coins className="mt-1 h-6 w-6 shrink-0 text-cyan" />
            <div>
              <p className="font-mono text-lg font-semibold text-foreground">
                {protocolFee.amount}
              </p>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                {protocolFee.description}
              </p>
              <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                Users pay a small fee to prove they&apos;re human. Integrators
                read on-chain state for free. Bot farms pay real money at
                scale.
              </p>
            </div>
          </div>
        </GlowCard>
      </section>

      {/* Revenue Flywheel */}
      <section className="mt-20">
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// REVENUE FLYWHEEL"}
        </TextShimmer>

        <h2 className="mt-4 font-mono text-xl font-bold text-foreground md:text-2xl">
          Verification volume drives token value.
        </h2>

        <div className="mt-8 space-y-4">
          {flywheel.map((step, i) => (
            <GlowCard key={i}>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan/10 font-mono text-sm font-bold text-cyan">
                  {i + 1}
                </div>
                <div>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {step.step}
                  </p>
                  <p className="mt-1 text-sm text-foreground/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Protocol revenue scales linearly with verification volume.
        </p>
      </section>

      {/* Token Distribution */}
      <section className="mt-20">
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// TOKEN DISTRIBUTION"}
        </TextShimmer>

        <h2 className="mt-4 font-mono text-xl font-bold text-foreground md:text-2xl">
          Fair launch. Community first.
        </h2>

        <div className="mt-8 grid gap-3">
          {tokenDistribution.map((allocation) => (
            <GlowCard key={allocation.name}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {allocation.name}
                  </p>
                  <p className="text-xs text-muted">{allocation.vesting}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 rounded-full bg-foreground/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan"
                      style={{ width: `${allocation.percentage * 2.5}%` }}
                    />
                  </div>
                  <p className="w-10 text-right font-mono text-sm font-bold text-cyan">
                    {allocation.percentage}%
                  </p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* Token Utility */}
      <section className="mt-20">
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// TOKEN UTILITY"}
        </TextShimmer>

        <h2 className="mt-4 font-mono text-xl font-bold text-foreground md:text-2xl">
          Stake. Govern. Validate.
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {tokenUtilities.map((utility, i) => {
            const icons = [Shield, Vote, Layers];
            const Icon = icons[i] ?? Shield;
            return (
              <GlowCard key={utility.title}>
                <Icon className="h-5 w-5 text-cyan" />
                <p className="mt-3 font-mono text-sm font-semibold text-foreground">
                  {utility.title}
                </p>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                  {utility.description}
                </p>
              </GlowCard>
            );
          })}
        </div>
      </section>

      {/* Launch */}
      <section className="mt-20">
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// LAUNCH"}
        </TextShimmer>

        <h2 className="mt-4 font-mono text-xl font-bold text-foreground md:text-2xl">
          Verified humans only.
        </h2>

        <GlowCard className="mt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Rocket className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
              <div>
                <p className="font-mono text-sm font-semibold text-foreground">
                  {launchDetails.mechanism}
                </p>
                <p className="mt-1 text-sm text-foreground/70 leading-relaxed">
                  {launchDetails.airdrop}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
              <div>
                <p className="font-mono text-sm font-semibold text-foreground">
                  {launchDetails.standard}
                </p>
                <p className="mt-1 text-sm text-foreground/70">
                  Supply fixed at genesis. Confidential Balances for private
                  staking.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
              <div>
                <p className="font-mono text-sm font-semibold text-foreground">
                  Revenue-backed from day one
                </p>
                <p className="mt-1 text-sm text-foreground/70">
                  The protocol generates SOL revenue before the token launches.
                  Treasury accumulates real value. The token amplifies the
                  flywheel—it doesn&apos;t create it.
                </p>
              </div>
            </div>
          </div>
        </GlowCard>
      </section>

      <section className="mt-20 text-center">
        <hr className="mx-auto mb-16 w-24 border-t border-foreground/[0.06]" />
        <p className="font-mono text-xl tracking-[0.02em] text-foreground md:text-2xl">
          Prove you&apos;re human. Build your Trust Score.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/verify">
            <ShimmerButton className="text-sm font-medium lg:text-base">
              <span className="flex items-center gap-2">
                Try the Demo
                <span aria-hidden="true">→</span>
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
