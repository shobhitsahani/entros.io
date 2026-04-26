import { SubpageHero } from "@/components/sections/subpage-hero";
import { ProtocolStats } from "@/components/sections/protocol-stats";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Protocol Stats",
  description:
    "Live on-chain metrics for the Entros Protocol—total anchors minted, trust scores, and verification activity on Solana devnet.",
  path: "/stats",
});

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
