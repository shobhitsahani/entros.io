import Link from "next/link";
import { TextShimmer } from "@/components/ui/text-shimmer";

const internalLinks = [
  { label: "Research paper", href: "/paper" },
];

const externalLinks = [
  {
    label: "On-chain programs (Solana Explorer)",
    href: "https://explorer.solana.com/address/GZYwTp2ozeuRA5Gof9vs4ya961aANcJBdUzB7LN6q4b2?cluster=devnet",
  },
  {
    label: "AUDIT.md (public fix tracker)",
    href: "https://github.com/entros-protocol/entros.io/blob/main/AUDIT.md",
  },
  {
    label: "Public adversarial baseline tests",
    href: "https://github.com/entros-protocol/pulse-sdk/blob/main/test/pentest.test.ts",
  },
  {
    label: "GitHub organization",
    href: "https://github.com/entros-protocol",
  },
];

export function References() {
  return (
    <section id="references" className="mx-auto max-w-4xl px-6 py-16">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
      >
        {"// REFERENCES"}
      </TextShimmer>
      <h2 className="mt-4 font-mono text-2xl font-semibold text-foreground md:text-3xl">
        Learn more
      </h2>
      <ul className="mt-8 space-y-3">
        {internalLinks.map((ref) => (
          <li key={ref.label}>
            <Link
              href={ref.href}
              className="text-sm text-cyan transition-colors hover:text-cyan/80"
            >
              {ref.label}
            </Link>
          </li>
        ))}
        {externalLinks.map((ref) => (
          <li key={ref.label}>
            <a
              href={ref.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan transition-colors hover:text-cyan/80"
            >
              {ref.label}
              <span className="ml-1 text-foreground/30">{"↗"}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
