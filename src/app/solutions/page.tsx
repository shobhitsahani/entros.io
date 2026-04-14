import type { Metadata } from "next";
import Link from "next/link";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { SolutionsHeroAnimation } from "@/components/sections/solutions-hero-animation";
import { SolutionCasesSection } from "@/components/sections/solution-cases-section";
import { IntegrationSection } from "@/components/sections/integration-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "IAM Protocol use cases: Sybil-resistant airdrops, human-verified governance, fair gaming mints, creator verification, bot prevention.",
};

export default function Solutions() {
  return (
    <>
      <SubpageHero
        title="Solutions"
        subtitle={"Proof-of-Humanity for protocols that need to know their users are real,\nwithout learning who they are."}
      />
      <SolutionsHeroAnimation />
      <SolutionCasesSection />
      <IntegrationSection />
      <PartnersSection />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <hr className="mx-auto mb-16 w-24 border-t border-foreground/[0.06]" />
        <p className="font-mono text-xl tracking-[0.02em] text-foreground md:text-2xl">
          Ready to integrate?
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/integrate">
            <ShimmerButton className="text-sm font-medium lg:text-base">
              <span className="flex items-center gap-2">
                Start Integrating
                <span aria-hidden="true">→</span>
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </section>
    </>
  );
}
