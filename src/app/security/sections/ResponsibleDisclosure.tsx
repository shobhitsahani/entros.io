import { TextShimmer } from "@/components/ui/text-shimmer";

const disclosureItems = [
  { label: "Contact", value: "contact@entros.io", isEmail: true },
  {
    label: "Scope",
    value:
      "On-chain programs, SDK, executor, validation service, website",
  },
  {
    label: "Response SLA",
    value:
      "Acknowledgment within 48 hours, initial triage within 5 business days",
  },
  {
    label: "Safe harbor",
    value:
      "Good-faith research is welcome. We will not pursue legal action against researchers acting within the scope of this policy.",
  },
  {
    label: "Attribution",
    value:
      "Researchers credited in AUDIT.md and hall of fame upon fix deployment, unless anonymity requested.",
  },
  {
    label: "Bug bounty",
    value: "Planned post-launch. Severity tiers and amounts TBD.",
  },
];

export function ResponsibleDisclosure() {
  return (
    <section id="disclosure" className="mx-auto max-w-4xl px-6 py-16">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
      >
        {"// DISCLOSURE"}
      </TextShimmer>
      <h2 className="mt-4 font-mono text-2xl font-semibold text-foreground md:text-3xl">
        Reporting vulnerabilities
      </h2>
      <div className="mt-8 space-y-4">
        {disclosureItems.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1 sm:flex-row sm:gap-4"
          >
            <span className="shrink-0 font-mono text-sm text-cyan/80 sm:w-36">
              {item.label}
            </span>
            {"isEmail" in item ? (
              <a
                href={`mailto:${item.value}`}
                className="text-sm text-cyan transition-colors hover:text-cyan/80"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-sm text-foreground/80 leading-relaxed">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
