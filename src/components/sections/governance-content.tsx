import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";
import { CodeBlock } from "@/components/ui/code-block";
import {
  ShieldCheck,
  Settings,
  Vote,
  Landmark,
  ExternalLink,
  Bot,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const steps = [
  {
    icon: Settings,
    title: "Configure",
    description:
      "DAO admin sets a minimum Trust Score and maximum verification age. One transaction creates the registrar. Update anytime.",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    description:
      "Each voter completes a behavioral verification through IAM Protocol. Their Trust Score grows with each re-verification over time.",
  },
  {
    icon: Vote,
    title: "Vote",
    description:
      "Before any governance action, the plugin reads the voter's IAM Anchor on-chain. Verified and recent: vote counted. Unverified or expired: vote blocked.",
  },
];

const REGISTRAR_CODE = `// DAO admin configures the IAM voter weight plugin
await program.methods
  .createRegistrar(
    100,      // min_trust_score (at least one re-verification)
    2592000,  // max_verification_age (30 days in seconds)
  )
  .accounts({
    realm: realmPubkey,
    governanceProgramId: govProgramId,
    governingTokenMint: mintPubkey,
    realmAuthority: admin.publicKey,
    payer: admin.publicKey,
  })
  .signers([admin])
  .rpc();`;

export function GovernanceContent() {
  return (
    <div className="space-y-32">
      {/* Problem */}
      <section className="relative">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
          <div>
            <TextShimmer
              as="span"
              className="font-mono text-base tracking-widest uppercase"
            >
              {"// THE PROBLEM"}
            </TextShimmer>
            <h2 className="mt-4 font-mono text-2xl font-bold text-foreground md:text-3xl">
              Nobody proves they showed up.
            </h2>
            <p className="mt-4 text-foreground/70 leading-relaxed">
              Bots vote on DAO proposals using delegated authority. Scripts
              auto-vote based on whale signaling. Wallets with staked tokens
              cast votes without the owner reading the proposal. AI agents act
              on behalf of humans without real-time authorization. No voter
              weight plugin verifies that a real human is present at the moment
              of voting.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <GlowCard className="w-full">
              <div className="space-y-8 py-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted text-center mb-5">
                    Standard governance
                  </p>
                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Bot className="h-6 w-6 text-foreground/30" strokeWidth={1.5} />
                      <p className="text-xs text-muted">Bot</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Bot className="h-6 w-6 text-foreground/30" strokeWidth={1.5} />
                      <p className="text-xs text-muted">Script</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <ShieldCheck className="h-6 w-6 text-foreground/30" strokeWidth={1.5} />
                      <p className="text-xs text-muted">Human</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted text-center mt-4">
                    All treated equally. No liveness check.
                  </p>
                </div>
                <div className="border-t border-border" />
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted text-center mb-5">
                    With IAM
                  </p>
                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Bot className="h-6 w-6 text-danger/40" strokeWidth={1.5} />
                      <p className="text-xs text-danger/50">Blocked</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Bot className="h-6 w-6 text-danger/40" strokeWidth={1.5} />
                      <p className="text-xs text-danger/50">Blocked</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <ShieldCheck className="h-7 w-7 text-cyan" />
                      <p className="text-xs text-cyan">Verified</p>
                    </div>
                  </div>
                  <p className="text-xs text-cyan/70 text-center mt-4">
                    Only live, recently verified humans can vote.
                  </p>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1">
            <GlowCard>
              <div className="py-4">
                <p className="font-mono text-sm uppercase tracking-widest text-muted text-center mb-8">
                  Governance liveness
                </p>

                <div className="flex items-center px-4 sm:px-8">
                  <div className="h-16 w-16 rounded-full border border-cyan/30 bg-cyan/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-7 w-7 text-cyan" />
                  </div>

                  <div className="flex-1 relative mx-3">
                    <div className="border-t-2 border-dashed border-cyan/30" />
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-sm text-cyan whitespace-nowrap">
                      voter_weight = 1
                    </span>
                  </div>

                  <div className="h-16 w-16 rounded-full border border-foreground/20 bg-foreground/5 flex items-center justify-center shrink-0">
                    <Landmark className="h-7 w-7 text-foreground/60" />
                  </div>
                </div>

                <div className="flex justify-between px-4 sm:px-8 mt-3">
                  <span className="text-sm font-mono text-muted w-16 text-center">
                    Human
                  </span>
                  <span className="text-sm font-mono text-muted w-16 text-center">
                    DAO
                  </span>
                </div>

                <p className="text-sm text-muted text-center mt-6 font-mono tracking-wide">
                  Present. Verified. On-chain.
                </p>
              </div>
            </GlowCard>
          </div>
          <div className="order-1 lg:order-2">
            <TextShimmer
              as="span"
              className="font-mono text-base tracking-widest uppercase"
            >
              {"// THE SOLUTION"}
            </TextShimmer>
            <h2 className="mt-4 font-mono text-2xl font-bold text-foreground md:text-3xl">
              Verified human.
              <br />
              Verified vote.
            </h2>
            <p className="mt-4 text-foreground/70 leading-relaxed">
              IAM&apos;s voter weight plugin reads the voter&apos;s Trust Score
              and verification recency from their IAM Anchor before every
              governance action. Voters must prove they are a real, live human
              with sustained behavioral history. Bots, scripts, and dormant
              wallets are excluded from governance.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <div className="text-center mb-10">
          <TextShimmer
            as="span"
            className="font-mono text-base tracking-widest uppercase"
          >
            {"// HOW IT WORKS"}
          </TextShimmer>
          <h2 className="mt-4 font-mono text-2xl font-bold text-foreground md:text-3xl">
            Three steps to verified governance.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <GlowCard key={step.title}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-cyan font-mono text-2xl font-bold">
                  {i + 1}
                </span>
                <step.icon
                  className="h-6 w-6 text-foreground/50"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-sans text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                {step.description}
              </p>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* Plugin chaining */}
      <section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
          <div>
            <TextShimmer
              as="span"
              className="font-mono text-base tracking-widest uppercase"
            >
              {"// PLUGIN CHAINING"}
            </TextShimmer>
            <h2 className="mt-4 font-mono text-xl font-bold text-foreground">
              Layer on top. Don&apos;t replace.
            </h2>
            <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
              IAM isn&apos;t meant to replace token-based governance. It layers
              human verification on top of existing plugins. Chain IAM with
              token-voter to require both token holdings and proof of human
              presence. Chain with quadratic voting for verified-human quadratic
              weights.
            </p>
          </div>
          <GlowCard>
            <div className="space-y-5 py-2">
              <div className="flex items-center gap-4">
                <Layers className="h-5 w-5 text-cyan shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    IAM + Token Voter
                  </p>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    Hold tokens AND prove you&apos;re human to vote
                  </p>
                </div>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center gap-4">
                <Layers className="h-5 w-5 text-cyan shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    IAM + Quadratic
                  </p>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    Quadratic voting weight, but only for verified humans
                  </p>
                </div>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center gap-4">
                <Layers className="h-5 w-5 text-cyan shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    IAM + NFT Voter
                  </p>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    NFT-gated governance with human liveness checks
                  </p>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>
      </section>

      {/* Configuration */}
      <section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
          <div>
            <TextShimmer
              as="span"
              className="font-mono text-base tracking-widest uppercase"
            >
              {"// CONFIGURATION"}
            </TextShimmer>
            <h2 className="mt-4 font-mono text-xl font-bold text-foreground">
              Two parameters. Full control.
            </h2>
            <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
              The DAO admin configures two values when creating the registrar.
              These can be updated at any time by the realm authority.
            </p>
            <div className="mt-6">
              <Link href="/verify">
                <ShimmerButton className="text-sm font-medium">
                  <span className="flex items-center gap-2">
                    Verify Now
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </ShimmerButton>
              </Link>
            </div>
          </div>
          <GlowCard>
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
              Registrar Parameters
            </p>
            <div className="space-y-5">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm text-cyan">
                    min_trust_score
                  </span>
                  <span className="font-mono text-xs text-foreground/40">
                    u16
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/60 leading-relaxed">
                  Minimum Trust Score required to cast a vote. 0 means any
                  verified identity qualifies. 100 requires at least one
                  re-verification. Higher values require longer behavioral
                  history.
                </p>
              </div>
              <div className="border-t border-border" />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm text-cyan">
                    max_verification_age
                  </span>
                  <span className="font-mono text-xs text-foreground/40">
                    i64
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/60 leading-relaxed">
                  Maximum seconds since last verification. 2592000 = 30 days.
                  604800 = 7 days. Expired voters must re-verify before voting.
                </p>
              </div>
            </div>
          </GlowCard>
        </div>
      </section>

      {/* For DAOs */}
      <section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
          <div>
            <TextShimmer
              as="span"
              className="font-mono text-base tracking-widest uppercase"
            >
              {"// FOR DAOs"}
            </TextShimmer>
            <h2 className="mt-4 font-mono text-xl font-bold text-foreground">
              Works with Realms today.
            </h2>
            <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
              The Realms V2 UI supports custom voter weight plugins. Paste the
              program ID in the &quot;Custom voting program ID&quot; field in
              your realm settings. No frontend changes required.
            </p>
            <p className="mt-4 font-mono text-sm text-cyan break-all">
              99nwXzcugse3x8kxE9v6mxZiq8T9gHDoznaaG6qcw534
            </p>
            <a
              href="https://github.com/iam-protocol/iam-governance-plugin"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
            >
              View source on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div>
            <CodeBlock code={REGISTRAR_CODE} />
          </div>
        </div>
      </section>
    </div>
  );
}
