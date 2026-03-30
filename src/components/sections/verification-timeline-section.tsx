"use client";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { Timeline } from "@/components/ui/timeline";
import { verificationSteps } from "@/data/verification-steps";
import { getIcon } from "@/lib/icons";

export function VerificationTimelineSection() {
  const timelineData = verificationSteps.map((step) => {
    const Icon = getIcon(step.icon);
    return {
      title: (
        <span className="inline-flex items-baseline gap-3">
          {step.title}
          <Icon className="h-7 w-7 shrink-0 text-foreground/30 self-center" strokeWidth={1.5} />
        </span>
      ),
      content: (
        <div>
          <p className="mb-4 text-lg font-semibold text-foreground">
            {step.description}
          </p>
          <p className="text-sm leading-relaxed text-foreground/60 max-w-xl">
            {step.detail}
          </p>
        </div>
      ),
    };
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// VERIFICATION FLOW"}
        </TextShimmer>

        <h2 className="mt-6 font-sans text-2xl font-semibold text-foreground md:text-3xl">
          Three stages, seven steps.
        </h2>
        <p className="mt-3 text-muted whitespace-pre-line">
          {"From behavioral challenge to on-chain proof.\nNo biometric data leaves your device at any point in this pipeline."}
        </p>
      </div>

      <div className="mt-16">
        <Timeline data={timelineData} />
      </div>
    </section>
  );
}
