import type { Metadata } from "next";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { TokenHeroAnimation } from "@/components/sections/token-hero-animation";
import { TokenContent } from "@/components/sections/token-content";

export const metadata: Metadata = {
  title: "Token",
  description:
    "Entros Token economics. Protocol fees, revenue flywheel, validator staking, and fair launch details.",
};

export default function Token() {
  return (
    <>
      <SubpageHero
        title="Entros Token"
        subtitle="The economic layer of verified humanity."
      />
      <TokenHeroAnimation />
      <TokenContent />
    </>
  );
}
