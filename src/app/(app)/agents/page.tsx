import type { Metadata } from "next";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { AgentsContent } from "@/components/sections/agents-content";
import { AgentsCheckSection } from "@/components/sections/agents-check-section";

export const metadata: Metadata = {
  title: "Agent Anchor",
  description:
    "Verify the human behind every AI agent on Solana. Link your IAM identity to your registered agents with immutable on-chain attestation.",
};

export default function Agents() {
  return (
    <>
      <SubpageHero
        title="Agent Anchor"
        subtitle={"Verify the human behind\nevery AI agent on Solana."}
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <AgentsContent />
        <AgentsCheckSection />
      </section>
    </>
  );
}
