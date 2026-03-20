"use client";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { Timeline } from "@/components/ui/timeline";
import { verificationSteps } from "@/data/verification-steps";
import { getIcon } from "@/lib/icons";

export function VerificationTimelineSection() {
  const timelineData = verificationSteps.map((step) => {
    const Icon = getIcon(step.icon);
    return {
      title: step.title,
      content: (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Icon className="h-6 w-6 text-foreground/50" strokeWidth={1.5} />
            <p className="text-lg font-semibold text-foreground">
              {step.description}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-foreground/60 max-w-xl">
            {step.detail}
          </p>
        </div>
      ),
    };
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
        duration={3}
      >
        {"// VERIFICATION FLOW"}
      </TextShimmer>

      <h2 className="mt-6 font-sans text-2xl font-semibold text-foreground md:text-3xl">
        Seven seconds, seven steps
      </h2>
      <p className="mt-3 text-muted max-w-2xl">
        From behavioral challenge to on-chain proof. No biometric data leaves
        your device at any point in this pipeline.
      </p>

      <div className="mt-12">
        <Timeline data={timelineData} />
      </div>
    </section>
  );
}
