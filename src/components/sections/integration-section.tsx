import { CodeBlock } from "@/components/ui/code-block";
import { integrationSnippets } from "@/data/integration-snippets";

/**
 * Integration — two verification modes side-by-side. Each panel: title,
 * description, code block. Mode label as a left-rail mono mark.
 */
export function IntegrationSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
          // INTEGRATION
        </span>

        <h2 className="mt-6 max-w-2xl font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
          Two modes, one SDK<span className="text-cyan">.</span>
        </h2>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/65 md:text-lg">
          Wallet-connected is the primary flow—a Groth16 ZK proof, a
          persistent on-chain Entros Anchor, a SAS attestation, and a
          Trust Score that compounds across re-verifications. Walletless
          is a captcha-equivalent tier for sign-up flows—device-bound,
          ephemeral, no on-chain identity written.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-px border-y border-border bg-border lg:grid-cols-2">
          {integrationSnippets.map((snippet, idx) => (
            <div key={snippet.mode} className="flex flex-col bg-background p-8 md:p-10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs tracking-[0.2em] text-cyan">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/50">
                  {snippet.mode === "wallet-connected"
                    ? "PRIMARY"
                    : "CAPTCHA TIER"}
                </span>
              </div>

              <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                {snippet.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-foreground/65">
                {snippet.description}
              </p>

              <div className="mt-6">
                <CodeBlock code={snippet.code} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
