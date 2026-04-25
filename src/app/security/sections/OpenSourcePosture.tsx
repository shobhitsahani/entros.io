import { TextShimmer } from "@/components/ui/text-shimmer";

const openSource = [
  "On-chain programs (entros-anchor, entros-verifier, entros-registry)",
  "ZK circuits and trusted setup artifacts",
  "Client SDK (pulse-sdk on npm)",
  "Executor node",
  "Website and documentation",
  "Security program page, blueprint documents, and aggregate results",
  "Baseline adversarial testing (script-kiddie tier in pulse-sdk)",
];

const privateComponents = [
  "Server-side validation service (entros-validation): check thresholds and parameter values",
  "Red-team harness (entros-redteam): attack code, per-attempt telemetry, captured baseline fixtures",
  "Pre-disclosure vulnerability reports (per standard responsible-disclosure practice)",
];

export function OpenSourcePosture() {
  return (
    <section id="open-source" className="mx-auto max-w-4xl px-6 py-16">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
      >
        {"// OPEN SOURCE"}
      </TextShimmer>
      <h2 className="mt-4 font-mono text-2xl font-semibold text-foreground md:text-3xl">
        What we open-source, and why
      </h2>
      <p className="mt-8 text-foreground/80 leading-relaxed">
        Entros Protocol is open-source where open-source matters for user trust,
        and deliberately private where privacy protects users. This follows
        the same disclosure convention used across crypto infrastructure
        projects. Not a departure from crypto&apos;s open-source values. A
        mature implementation of them.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border p-6">
          <h3 className="font-mono text-lg font-semibold text-cyan">
            Open source (MIT)
          </h3>
          <ul className="mt-4 space-y-2">
            {openSource.map((item, i) => (
              <li
                key={i}
                className="text-sm text-foreground/80 leading-relaxed"
              >
                <span className="mr-2 text-cyan/60">&rsaquo;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border p-6">
          <h3 className="font-mono text-lg font-semibold text-foreground/60">
            Private (defense-layer only)
          </h3>
          <ul className="mt-4 space-y-2">
            {privateComponents.map((item, i) => (
              <li
                key={i}
                className="text-sm text-foreground/80 leading-relaxed"
              >
                <span className="mr-2 text-foreground/30">&rsaquo;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-8 text-foreground/80 leading-relaxed">
        Nothing that affects verifiable protocol behavior is private. Every
        on-chain transition, every cryptographic operation, every client-side
        computation is open and auditable. The private components are the
        detection surface an attacker would otherwise exploit to calibrate their
        attacks.
      </p>
    </section>
  );
}
