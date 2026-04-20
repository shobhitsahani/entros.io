import { TextShimmer } from "@/components/ui/text-shimmer";

const taxonomy = [
  {
    tier: "T1",
    attackClass: "Procedural synthesis (script-kiddie baseline)",
    tests: "Absolute attacker floor",
  },
  {
    tier: "T2",
    attackClass: "Parameter-varied procedural",
    tests: "Tier 1 cross-modality and variance checks",
  },
  {
    tier: "T3",
    attackClass: "Feature-space optimization with source access",
    tests: "Tier 1 distributional realism",
  },
  {
    tier: "T4a",
    attackClass: "Pre-recorded human voice + procedural motion/touch",
    tests: "Cross-modal temporal coupling (Tier 2)",
  },
  {
    tier: "T4b",
    attackClass: "Modern voice cloning (XTTS-v2, F5-TTS, API-based)",
    tests: "Tier 1 TTS artifact detection",
  },
  {
    tier: "T5",
    attackClass: "Coupled cross-modal synthesis",
    tests: "Tier 2 temporal coupling",
  },
  {
    tier: "T6",
    attackClass: "Targeted human-mimicry / identity theft",
    tests: "Hamming distance gate + Sybil registry",
  },
  {
    tier: "T7",
    attackClass: "Replay with adversarial perturbation",
    tests: "Min-distance floor + commitment registry",
  },
  {
    tier: "T8",
    attackClass: "Black-box adaptive probing",
    tests: "Rate limits + response opacity",
  },
];

export function RedTeamProgram() {
  return (
    <section id="red-team" className="mx-auto max-w-4xl px-6 py-16">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
      >
        {"// RED TEAM"}
      </TextShimmer>
      <h2 className="mt-4 font-mono text-2xl font-semibold text-foreground md:text-3xl">
        How we test our defenses
      </h2>
      <p className="mt-8 text-foreground/80 leading-relaxed">
        We maintain an internal adversarial testing harness that runs
        continuously against our production verification pipeline. The harness
        implements eight distinct attack tiers, ordered by sophistication. Each
        campaign generates hundreds to thousands of bot attempts, measures pass
        rates per defense layer, and feeds the results into threshold
        calibration and defense roadmap decisions.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-cyan/20">
              <th scope="col" className="py-3 pr-6 text-left font-mono text-cyan/80">
                Tier
              </th>
              <th scope="col" className="py-3 pr-6 text-left font-mono text-cyan/80">
                Attack class
              </th>
              <th scope="col" className="py-3 text-left font-mono text-cyan/80">
                Tests defense against
              </th>
            </tr>
          </thead>
          <tbody>
            {taxonomy.map((row) => (
              <tr key={row.tier} className="border-b border-border">
                <td className="py-3 pr-6 font-mono text-foreground">
                  {row.tier}
                </td>
                <td className="py-3 pr-6 text-foreground/80">
                  {row.attackClass}
                </td>
                <td className="py-3 text-foreground/60">{row.tests}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-foreground/80 leading-relaxed">
        Attack implementation code, per-attempt telemetry, and specific
        parameter values that produce elevated pass rates are kept in a private
        repository. This follows the same disclosure convention used by
        infrastructure security programs: methodology public, weapons private.
      </p>
    </section>
  );
}
