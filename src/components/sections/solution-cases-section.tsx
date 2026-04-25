"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { solutionCases } from "@/data/solution-cases";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function SolutionCasesSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// USE CASES"}
      </TextShimmer>

      <h2 className="mt-6 font-sans text-2xl font-semibold text-foreground md:text-3xl">
        Where Entros fits
      </h2>

      <div className="mt-10 space-y-2">
        {solutionCases.map((c, i) => {
          const Icon = getIcon(c.icon);
          const isExpanded = expandedIndex === i;

          return (
            <motion.div
              key={c.title}
              layout
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
              className={cn(
                "cursor-pointer rounded-xl border bg-surface/30 transition-colors",
                isExpanded
                  ? "border-border-hover"
                  : "border-border hover:border-border-hover"
              )}
            >
              <div className="flex items-center gap-4 px-6 py-5">
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isExpanded ? "text-cyan" : "text-foreground/60"
                  )}
                  strokeWidth={1.5}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans text-base font-semibold text-foreground">
                    {c.title}
                  </h3>
                </div>
                <span className="hidden sm:block text-xs font-mono uppercase tracking-widest text-cyan shrink-0">
                  {c.category}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-foreground/30 transition-transform duration-200",
                    isExpanded && "rotate-180 text-cyan"
                  )}
                  strokeWidth={1.5}
                />
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-6 border-t border-border px-6 py-6 md:grid-cols-3">
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">
                          Problem
                        </p>
                        <p className="text-sm leading-relaxed text-foreground/70">
                          {c.problem}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">
                          Solution
                        </p>
                        <p className="text-sm leading-relaxed text-foreground/70">
                          {c.solution}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">
                          Example
                        </p>
                        <p className="text-sm leading-relaxed text-foreground/70">
                          {c.example}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
