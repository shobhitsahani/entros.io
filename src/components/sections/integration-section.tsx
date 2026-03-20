import { TextShimmer } from "@/components/ui/text-shimmer";
import { CodeBlock } from "@/components/ui/code-block";
import { integrationSnippets } from "@/data/integration-snippets";

export function IntegrationSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
        duration={3}
      >
        {"// INTEGRATION"}
      </TextShimmer>

      <h2 className="mt-6 font-sans text-2xl font-semibold text-foreground md:text-3xl">
        Two modes, one SDK
      </h2>
      <p className="mt-3 text-muted max-w-2xl">
        Walletless mode for non-crypto users. Wallet-connected mode for DeFi
        natives. Both produce the same on-chain proof.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {integrationSnippets.map((snippet) => (
          <div key={snippet.mode}>
            <h3 className="font-sans text-lg font-semibold text-foreground">
              {snippet.title}
            </h3>
            <p className="mt-2 text-sm text-foreground/60">
              {snippet.description}
            </p>
            <div className="mt-4">
              <CodeBlock code={snippet.code} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
