import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { SolutionCasesSection } from "@/components/sections/solution-cases-section";
import { IntegrationSection } from "@/components/sections/integration-section";
import { PartnersSection } from "@/components/sections/partners-section";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "IAM Protocol use cases: Sybil-proof airdrops, one-person-one-vote DAOs, fair gaming mints, creator verification, bot prevention.",
};

export default function Solutions() {
  return (
    <>
      <SubpageHero
        title="Solutions"
        subtitle="Proof-of-Humanity for protocols that need to know their users are real, without learning who they are."
      />
      <SolutionCasesSection />
      <IntegrationSection />
      <PartnersSection />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <hr className="mx-auto mb-16 w-24 border-t border-foreground/[0.06]" />
        <p className="font-mono text-xl tracking-[0.02em] text-foreground md:text-2xl">
          Ready to integrate?
        </p>
        <div className="mt-8">
          <Link
            href="/integrate"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-muted transition-all duration-200 hover:border-border-hover hover:text-foreground"
          >
            Start integrating
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
