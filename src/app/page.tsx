import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { WhySolanaSection } from "@/components/sections/why-solana-section";
import { UseCasesSection } from "@/components/sections/use-cases-section";
import { ForDevelopersSection } from "@/components/sections/for-developers-section";
import { TrustSignalsSection } from "@/components/sections/trust-signals-section";
import { FooterCTASection } from "@/components/sections/footer-cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <WhySolanaSection />
      <UseCasesSection />
      <ForDevelopersSection />
      <TrustSignalsSection />
      <FooterCTASection />
    </>
  );
}
