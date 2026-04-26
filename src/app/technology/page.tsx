import Link from "next/link";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { VerificationTimelineSection } from "@/components/sections/verification-timeline-section";
import { ProtocolComponentsSection } from "@/components/sections/protocol-components-section";
import { PrivacySection } from "@/components/sections/privacy-section";
import { SecurityModelSection } from "@/components/sections/security-model-section";
import { VerificationModesSection } from "@/components/sections/verification-modes-section";
import { ResearchValidationSection } from "@/components/sections/research-validation-section";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { VerificationOrb } from "@/components/ui/verification-orb";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Technology",
  description:
    "How Entros verification works. Seven steps from behavioral challenge to on-chain proof. Raw recordings never leave your device.",
  path: "/technology",
});

export default function Technology() {
  return (
    <>
      <SubpageHero
        title="How It Works"
        subtitle="The full verification pipeline, end to end."
      />
      <VerificationOrb />
      <VerificationTimelineSection />
      <ProtocolComponentsSection />
      <PrivacySection />
      <SecurityModelSection />
      <VerificationModesSection />
      <ResearchValidationSection />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <hr className="mx-auto mb-16 w-24 border-t border-foreground/[0.06]" />
        <p className="font-mono text-xl tracking-[0.02em] text-foreground md:text-2xl">
          Raw data stays on your device. Statistical features are validated. Proof goes on-chain.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/solutions">
            <ShimmerButton className="text-sm font-medium lg:text-base">
              <span className="flex items-center gap-2">
                See Use Cases
                <span aria-hidden="true">→</span>
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </section>
    </>
  );
}
