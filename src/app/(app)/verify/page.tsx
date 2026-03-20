import type { Metadata } from "next";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { VerifyFlow } from "@/components/sections/verify-flow";

export const metadata: Metadata = {
  title: "Verify",
  description:
    "Prove you are human with IAM Protocol. Walletless or wallet-connected verification on Solana devnet.",
};

export default function Verify() {
  return (
    <>
      <SubpageHero
        title="Prove You Are Human"
        subtitle={"Seven seconds of voice, motion, and touch.\nChoose walletless mode or connect your Solana wallet."}
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <VerifyFlow />
      </section>
    </>
  );
}
