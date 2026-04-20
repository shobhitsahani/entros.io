import { Fragment } from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import {
  campaignResults,
  lastUpdated,
  t4aNote,
  onChainBurstNote,
} from "@/data/security-metrics";

export function LatestResults() {
  return (
    <section id="measurements" className="mx-auto max-w-4xl px-6 py-16">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
      >
        {"// MEASUREMENTS"}
      </TextShimmer>
      <h2 className="mt-4 font-mono text-2xl font-semibold text-foreground md:text-3xl">
        Current measurements
      </h2>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-cyan/20">
              <th scope="col" className="py-3 pr-6 text-left font-mono text-cyan/80">
                Attack tier
              </th>
              <th scope="col" className="py-3 pr-6 text-left font-mono text-cyan/80">
                Description
              </th>
              <th scope="col" className="py-3 pr-6 text-right font-mono text-cyan/80">
                Attempts
              </th>
              <th scope="col" className="py-3 pr-6 text-right font-mono text-cyan/80">
                Pass rate
              </th>
              <th scope="col" className="py-3 text-left font-mono text-cyan/80">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {campaignResults.map((row) => (
              <Fragment key={row.tier}>
                <tr className="border-b border-border">
                  <td className="py-3 pr-6 font-mono text-foreground whitespace-nowrap">
                    {row.tier}
                  </td>
                  <td className="py-3 pr-6 text-foreground/80">
                    {row.description}
                  </td>
                  <td className="py-3 pr-6 text-right font-mono text-foreground/70">
                    {row.attempts}
                  </td>
                  <td className="py-3 pr-6 text-right font-mono text-foreground/80">
                    {row.passRate}
                  </td>
                  <td className="py-3 text-foreground/60">{row.status}</td>
                </tr>
                {row.note && (
                  <tr className="border-b border-border/40">
                    <td colSpan={5} className="py-2 pr-6 text-xs text-foreground/55 leading-relaxed">
                      {row.note}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-muted">Last updated: {lastUpdated}</p>
      <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
        Pass rate = fraction of bot attempts that pass server-side Tier 1
        validation, the gate preceding on-chain submission. An attempt that
        fails Tier 1 cannot proceed to challenge fetch, proof generation, or
        transaction submission. Results rounded to prevent adversarial threshold
        inference.
      </p>

      <div className="mt-10 rounded-lg border border-cyan/15 bg-cyan/[0.02] p-5">
        <p className="font-mono text-xs tracking-widest uppercase text-cyan/70">
          // T4A — TWO-WAVE STUDY
        </p>
        <p className="mt-3 text-sm text-foreground/75 leading-relaxed">
          {t4aNote}
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-foreground/[0.02] p-5">
        <p className="font-mono text-xs tracking-widest uppercase text-foreground/60">
          // ON-CHAIN ANCHOR STATE
        </p>
        <p className="mt-3 text-sm text-foreground/65 leading-relaxed">
          {onChainBurstNote}
        </p>
      </div>
    </section>
  );
}
