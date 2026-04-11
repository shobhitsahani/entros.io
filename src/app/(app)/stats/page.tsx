import type { Metadata } from "next";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { ProtocolStats } from "@/components/sections/protocol-stats";

export const metadata: Metadata = {
  title: "Protocol Stats",
  description:
    "Live on-chain metrics for the IAM Protocol—total anchors minted, trust scores, and verification activity on Solana devnet.",
};

export default function Stats() {
  return (
    <>
      <SubpageHero
        title="Protocol Stats"
        subtitle={"Live on-chain metrics read directly from Solana devnet.\nNo backend. No cache."}
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <ProtocolStats />
      </section>
    </>
  );
}
