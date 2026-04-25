export interface TrustSignal {
  icon: string;
  name: string;
  description: string;
  detail: string;
  href: string;
  cta: string;
  gridArea: string;
}

export const trustSignals: TrustSignal[] = [
  {
    icon: "shield",
    name: "Security Audit",
    description: "Scheduled for mainnet launch.",
    detail: "Anchor constraints, PDA validation, and compute-budget tested. External firm review before mainnet.",
    href: "/technology",
    cta: "View security details",
    gridArea: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    icon: "github",
    name: "Open Protocol",
    description: "Protocol layer is fully public.",
    detail: "MIT licensed. 3 Anchor programs, 1 Circom circuit, 1 TypeScript SDK on GitHub. Server-side validation models are proprietary—open protocol for trust, private defense for security.",
    href: "https://github.com/entros-protocol",
    cta: "View on GitHub",
    gridArea: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4",
  },
  {
    icon: "globe",
    name: "Integration Partners",
    description: "Five protocols targeted for devnet pilot.",
    detail: "Conversations with Jupiter, Marinade, Tensor, Drift, and Realms.",
    href: "/solutions",
    cta: "See use cases",
    gridArea: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    icon: "zap",
    name: "Devnet Live",
    description: "Programs deployed and accepting requests.",
    detail: "Full test suite passing across all repos. Verification pipeline operational on Solana devnet.",
    href: "/verify",
    cta: "Try it now",
    gridArea: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-4",
  },
];
