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
    cta: "Learn more",
    gridArea: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    icon: "github",
    name: "Open Source",
    description: "Verify the code yourself.",
    detail: "MIT licensed. 3 Anchor programs, 1 Circom circuit, 1 TypeScript SDK. All on GitHub.",
    href: "https://github.com/iam-protocol",
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
    detail: "16 integration tests passing. Full verification pipeline operational on Solana devnet.",
    href: "/verify",
    cta: "Try it now",
    gridArea: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-4",
  },
];
