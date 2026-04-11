import { TextShimmer } from "@/components/ui/text-shimmer";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { trustSignals } from "@/data/trust-signals";
import { getIcon } from "@/lib/icons";

export function TrustSignalsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// STATUS"}
      </TextShimmer>

      <div className="mt-12">
        <BentoGrid className="auto-rows-[16rem] lg:grid-cols-3 lg:grid-rows-3">
          {trustSignals.map((signal) => (
            <BentoCard
              key={signal.name}
              name={signal.name}
              description={signal.description}
              detail={signal.detail}
              Icon={getIcon(signal.icon)}
              href={signal.href}
              cta={signal.cta}
              className={signal.gridArea}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
