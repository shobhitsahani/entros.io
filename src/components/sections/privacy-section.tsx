import { TextShimmer } from "@/components/ui/text-shimmer";
import { privacyGuarantees } from "@/data/privacy-guarantees";
import { getIcon } from "@/lib/icons";

export function PrivacySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// PRIVACY GUARANTEES"}
      </TextShimmer>

      <h2 className="mt-6 font-sans text-2xl font-semibold text-foreground md:text-3xl">
        What the protocol guarantees
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {privacyGuarantees.map((guarantee) => {
          const Icon = getIcon(guarantee.icon);
          return (
            <div
              key={guarantee.title}
              className="flex gap-4"
            >
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-foreground/50"
                strokeWidth={1.5}
              />
              <div>
                <h3 className="font-sans text-base font-semibold text-foreground">
                  {guarantee.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                  {guarantee.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
