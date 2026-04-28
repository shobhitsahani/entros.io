"use client";

import { Timeline } from "@/components/ui/timeline";
import { verificationSteps } from "@/data/verification-steps";
import { getIcon } from "@/lib/icons";

export function VerificationTimelineSection() {
  const timelineData = verificationSteps.map((step) => {
    const Icon = getIcon(step.icon);
    // Keep the last word and the icon as a single non-wrapping unit so
    // titles like "03—Extract + Score" break in front of "Score" rather
    // than orphaning the icon onto its own line.
    const words = step.title.split(" ");
    const last = words.pop() ?? "";
    const head = words.join(" ");
    return {
      title: (
        <span className="font-display text-foreground">
          {head}
          {head && " "}
          <span className="whitespace-nowrap">
            {last}
            <Icon
              className="ml-3 inline-block h-7 w-7 align-middle text-cyan"
              strokeWidth={1.5}
            />
          </span>
        </span>
      ),
      content: (
        <div>
          <p className="mb-4 text-lg font-semibold text-foreground">
            {step.description}
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-foreground/60">
            {step.detail}
          </p>
        </div>
      ),
    };
  });

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-24 md:pt-16 md:pb-32">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
            // VERIFICATION FLOW
          </span>

          <h2 className="mx-auto mt-6 max-w-4xl font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
            <span className="text-cyan">12</span> seconds
            <span className="text-cyan">.</span> The rest is automatic
            <span className="text-cyan">.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 md:text-lg">
            Speak a phrase, trace a curve. Feature extraction, proof
            generation, and on-chain verification run automatically.
          </p>
        </div>

        <div className="mt-16">
          <Timeline data={timelineData} />
        </div>
      </div>
    </section>
  );
}
