import type { Metadata } from "next";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { GovernanceContent } from "@/components/sections/governance-content";

export const metadata: Metadata = {
  title: "Entros Governance Plugin",
  description:
    "Human-verified governance for Solana DAOs. Every vote backed by a live, recently verified human.",
};

export default function Governance() {
  return (
    <>
      <SubpageHero
        title="Entros Governance Plugin"
        subtitle={"Human-verified governance\u00A0for\u00A0Solana\u00A0DAOs.\nEvery vote backed by a live, recently\u00A0verified\u00A0human."}
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <GovernanceContent />
      </section>
    </>
  );
}
