"use client";

import { useState } from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { solutionCases } from "@/data/solution-cases";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function SolutionCasesSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const tabs = solutionCases.map((c) => ({
    title: c.title,
    icon: getIcon(c.icon),
  }));

  const selected =
    selectedIndex !== null ? solutionCases[selectedIndex] : undefined;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
        duration={3}
      >
        {"// USE CASES"}
      </TextShimmer>

      <h2 className="mt-6 font-sans text-2xl font-semibold text-foreground md:text-3xl">
        Where IAM fits
      </h2>

      <div className="mt-10 flex justify-center">
        <ExpandableTabs tabs={tabs} onChange={setSelectedIndex} />
      </div>

      {selected ? (
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-surface/50 p-8 backdrop-blur-[12px]">
          <span className="font-mono text-xs tracking-widest uppercase text-cyan">
            {selected.category}
          </span>
          <h3 className="mt-2 font-sans text-xl font-semibold text-foreground">
            {selected.title}
          </h3>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">
                Problem
              </p>
              <p className="text-sm leading-relaxed text-foreground/70">
                {selected.problem}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">
                Solution
              </p>
              <p className="text-sm leading-relaxed text-foreground/70">
                {selected.solution}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">
                Example
              </p>
              <p className="text-sm leading-relaxed text-foreground/70">
                {selected.example}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutionCases.map((c, i) => {
            const Icon = getIcon(c.icon);
            return (
              <button
                key={c.title}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "rounded-xl border border-border bg-surface/30 p-6 text-left",
                  "transition-colors hover:border-border-hover"
                )}
              >
                <Icon
                  className="mb-3 h-5 w-5 text-foreground/50"
                  strokeWidth={1.5}
                />
                <span className="block text-xs font-mono uppercase tracking-widest text-cyan">
                  {c.category}
                </span>
                <h3 className="mt-1 font-sans text-base font-semibold text-foreground">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/60 line-clamp-2">
                  {c.solution}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
