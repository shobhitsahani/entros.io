import { TextShimmer } from "@/components/ui/text-shimmer";
import { FeatureCard } from "@/components/ui/feature-card";
import { useCases } from "@/data/use-cases";
import { getIcon } from "@/lib/icons";

export function UseCasesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
        duration={3}
      >
        {"// USE CASES"}
      </TextShimmer>

      <div className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-3">
        {useCases.map((useCase, index) => {
          const Icon = getIcon(useCase.icon);
          return (
            <FeatureCard
              key={useCase.title}
              title={useCase.title}
              description={useCase.solution}
              icon={<Icon className="h-6 w-6" />}
              index={index}
            />
          );
        })}
      </div>
    </section>
  );
}
