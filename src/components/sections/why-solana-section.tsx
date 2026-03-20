import { TextShimmer } from "@/components/ui/text-shimmer";
import { Counter } from "@/components/ui/counter";
import { solanaStats } from "@/data/stats";

export function WhySolanaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
        duration={3}
      >
        {"// WHY SOLANA"}
      </TextShimmer>

      <div className="mt-12 border-y border-border py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {solanaStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-3xl font-bold text-foreground md:text-4xl">
                {stat.numericValue != null ? (
                  <Counter
                    target={stat.numericValue}
                    prefix={stat.value.startsWith("$") ? "$" : ""}
                    suffix={stat.suffix}
                  />
                ) : (
                  stat.value
                )}
              </div>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
