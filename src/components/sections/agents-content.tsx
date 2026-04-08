import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";
import { AgentNetworkAnimation } from "@/components/ui/agent-network-animation";
import { ShieldCheck, Bot, Link2 } from "lucide-react";
import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const steps = [
  {
    icon: ShieldCheck,
    title: "Verify as human",
    description:
      "Complete a behavioral verification to prove you're human. Your IAM Anchor is minted on Solana with a Trust Score that grows over time.",
  },
  {
    icon: Bot,
    title: "Register your agent",
    description:
      "Register your AI agent on the Solana Agent Registry. Your agent gets a Metaplex Core NFT identity on-chain.",
  },
  {
    icon: Link2,
    title: "Attest with Agent Anchor",
    description:
      "Link your IAM Anchor to your agent with one transaction. The attestation is immutable and on-chain. Any platform can verify the link.",
  },
];

export function AgentsContent() {
  return (
    <div className="space-y-16">
      {/* Problem section with animation */}
      <section className="relative">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-center">
          <div className="lg:pr-4">
            <TextShimmer
              as="span"
              className="font-mono text-base tracking-widest uppercase"
            >
              {"// THE PROBLEM"}
            </TextShimmer>
            <h2 className="mt-4 font-mono text-2xl font-bold text-foreground md:text-3xl">
              AI agents have no human accountability.
            </h2>
            <p className="mt-4 text-foreground/70 leading-relaxed">
              Thousands of AI agents are registered on Solana. They trade, vote,
              execute transactions, and interact with protocols autonomously. But
              none of them can prove a real human operates them. Anyone can
              register unlimited anonymous agents with no link between the
              agent&apos;s on-chain identity and a verified person.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <AgentNetworkAnimation className="w-full max-w-[460px] h-auto" />
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
                  On-chain attestation
                </p>

                {/* Diagram: circles + connecting line */}
                <div className="flex items-center px-4 sm:px-8">
                  <div className="h-16 w-16 rounded-full border border-cyan/30 bg-cyan/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-7 w-7 text-cyan" />
                  </div>

                  <div className="flex-1 relative mx-3">
                    <div className="border-t-2 border-dashed border-cyan/30" />
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-sm text-cyan whitespace-nowrap">
                      iam:human-operator
                    </span>
                  </div>

                  <div className="h-16 w-16 rounded-full border border-foreground/20 bg-foreground/5 flex items-center justify-center shrink-0">
                    <Bot className="h-7 w-7 text-foreground/60" />
                  </div>
                </div>

                {/* Labels under circles */}
                <div className="flex justify-between px-4 sm:px-8 mt-3">
                  <span className="text-sm font-mono text-muted w-16 text-center">
                    Human
                  </span>
                  <span className="text-sm font-mono text-muted w-16 text-center">
                    Agent
                  </span>
                </div>

                <p className="text-sm text-muted text-center mt-6 font-mono tracking-wide">
                  Immutable. Verifiable. On-chain.
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
              One person. One identity.
              <br />
              All their agents.
            </h2>
            <p className="mt-4 text-foreground/70 leading-relaxed">
              Agent Anchor writes immutable metadata on a registered agent
              linking it to its verified human operator&apos;s IAM Anchor. One
              human, one Trust Score. Register 100 agents and all 100 trace back
              to the same verified identity. Platforms can set policies: minimum
              Trust Score to register, maximum agents per operator.
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
            Three steps to human accountability.
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

      {/* For integrators */}
      <section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
          <div>
            <TextShimmer
              as="span"
              className="font-mono text-base tracking-widest uppercase"
            >
              {"// FOR INTEGRATORS"}
            </TextShimmer>
            <h2 className="mt-4 font-mono text-xl font-bold text-foreground">
              One function call.
            </h2>
            <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
              Check if any agent has a verified human operator. Returns the
              operator&apos;s Trust Score, verification timestamp, and wallet
              address. Works on devnet and mainnet.
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
          <div className="rounded-lg border border-border bg-code-bg p-6 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground leading-relaxed">
              <span className="text-cyan">{"import"}</span>
              {" { getAgentHumanOperator } "}
              <span className="text-cyan">{"from"}</span>
              {" "}
              <span className="text-solana-green">
                {"'@iam-protocol/pulse-sdk'"}
              </span>
              {";\n\n"}
              <span className="text-cyan">{"const"}</span>
              {" operator = "}
              <span className="text-cyan">{"await"}</span>
              {" "}
              <span className="text-[#C084FC]">{"getAgentHumanOperator"}</span>
              {"(agentAsset);\n\n"}
              <span className="text-cyan">{"if"}</span>
              {" (operator) {\n"}
              {"  "}
              <span className="text-[#9090A0]">
                {"// { anchorPda, trustScore, verifiedAt, wallet }"}
              </span>
              {"\n  console."}
              <span className="text-[#C084FC]">{"log"}</span>
              {"('Trust Score:', operator.trustScore);\n}"}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
