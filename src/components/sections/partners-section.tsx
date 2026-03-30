import Image from "next/image";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { integrationPartners } from "@/data/integration-partners";
import { getIcon } from "@/lib/icons";

export function PartnersSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// TARGET INTEGRATIONS"}
      </TextShimmer>

      <h2 className="mt-6 font-sans text-2xl font-semibold text-foreground md:text-3xl">
        Building with the Solana ecosystem
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {integrationPartners.map((partner) => {
          const Icon = getIcon(partner.icon);
          return (
            <div
              key={partner.name}
              className="rounded-xl border border-border bg-surface/30 p-6 transition-colors hover:border-border-hover"
            >
              <div className="mb-3 flex items-center gap-3">
                {partner.logoUrl ? (
                  <Image
                    src={partner.logoUrl}
                    alt={`${partner.name} logo`}
                    width={28}
                    height={28}
                    className="rounded-full"
                    unoptimized
                  />
                ) : (
                  <Icon
                    className="h-7 w-7 text-foreground/50"
                    strokeWidth={1.5}
                  />
                )}
                <h3 className="font-sans text-base font-semibold text-foreground">
                  {partner.name}
                </h3>
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan">
                {partner.category}
              </span>
              <p className="mt-2 text-sm text-foreground/60">
                {partner.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
