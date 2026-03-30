import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";
import { features } from "@/data/features";
import { getIcon } from "@/lib/icons";

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
        duration={3}
      >
        {"// HOW IT WORKS"}
      </TextShimmer>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = getIcon(feature.icon);
          return (
            <GlowCard key={feature.title}>
              <Icon className="mb-6 h-8 w-8 text-foreground/50" strokeWidth={1.5} />
              <h2 className="mb-3 font-sans text-xl font-semibold text-foreground">
                {feature.title}
              </h2>
              <p className="text-sm leading-relaxed text-foreground/60">
                {feature.description}
              </p>
              <p className="mt-4 text-sm text-foreground/60">
                {feature.benefit}
              </p>
            </GlowCard>
          );
        })}
      </div>
    </section>
  );
}
