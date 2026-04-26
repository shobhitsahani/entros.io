import { SubpageHero } from "@/components/sections/subpage-hero";
import { AgentsContent } from "@/components/sections/agents-content";
import { AgentsCheckSection } from "@/components/sections/agents-check-section";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Entros Agent Anchor",
  description:
    "Verify the human behind every AI agent on Solana. Link your Entros identity to your registered agents with immutable on-chain attestation.",
  path: "/agents",
});

export default function Agents() {
  return (
    <>
      <SubpageHero
        title="Entros Agent Anchor"
        subtitle={"Verify\u00A0the\u00A0human\u00A0behind\u00A0every AI\u00A0agent\u00A0on\u00A0Solana."}
      />
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <AgentsContent />
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <AgentsCheckSection />
      </section>
    </>
  );
}
