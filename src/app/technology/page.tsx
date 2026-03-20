import type { Metadata } from "next";
import Link from "next/link";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { VerificationTimelineSection } from "@/components/sections/verification-timeline-section";
import { ProtocolComponentsSection } from "@/components/sections/protocol-components-section";
import { PrivacySection } from "@/components/sections/privacy-section";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "How IAM verification works. Seven steps from behavioral challenge to on-chain proof, with zero biometric data transmitted.",
};

export default function Technology() {
  return (
    <>
      <SubpageHero
        title="How It Works"
        subtitle="Seven seconds of voice, motion, and touch. Processed on your device. Verified on Solana. Nothing stored, nothing transmitted."
      />
      <VerificationTimelineSection />
      <ProtocolComponentsSection />
      <PrivacySection />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <hr className="mx-auto mb-16 w-24 border-t border-foreground/[0.06]" />
        <p className="font-mono text-xl tracking-[0.02em] text-foreground md:text-2xl">
          See it for yourself.
        </p>
        <div className="mt-8">
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
    </>
  );
}
