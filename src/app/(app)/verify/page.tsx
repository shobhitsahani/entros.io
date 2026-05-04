import { VerifyFlow } from "@/components/sections/verify-flow";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Verify",
  description:
    "Prove you are human with Entros Protocol. Wallet-connected verification on Solana devnet, with a no-wallet capture preview.",
  path: "/verify",
});

export default function Verify() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-7xl px-6 pt-32 pb-12 text-center md:pt-40 md:pb-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
            // VERIFY
          </span>

          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-[-0.02em] text-foreground md:text-6xl lg:text-7xl">
            Mint your Anchor<span className="text-cyan">.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-foreground/65 md:mt-8 md:text-lg">
            Twelve seconds of voice, motion, and touch. Connect your Solana
            wallet to mint an Entros Anchor with a portable, on-chain Trust
            Score. A no-wallet preview is available for trying the capture
            flow.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32">
        <VerifyFlow />
      </section>
    </>
  );
}
