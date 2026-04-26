import { SubpageHero } from "@/components/sections/subpage-hero";
import { TokenHeroAnimation } from "@/components/sections/token-hero-animation";
import { TokenContent } from "@/components/sections/token-content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Token",
  description:
    "Entros Token economics. Protocol fees, revenue flywheel, validator staking, and fair launch details.",
  path: "/token",
});

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
