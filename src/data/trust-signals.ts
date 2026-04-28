export interface TrustSignal {
  icon: string;
  name: string;
  description: string;
  detail: string;
  href: string;
}

export const trustSignals: TrustSignal[] = [
  {
    icon: "shield",
    name: "Security Audit",
    description: "Scheduled for mainnet launch.",
    detail:
      "Anchor constraints, PDA validation, and compute-budget tested. External firm review before mainnet.",
    href: "/security",
  },
  {
    icon: "github",
    name: "Open Protocol",
    description: "Protocol layer is fully public.",
    detail:
      "MIT licensed. 3 Anchor programs, 1 Circom circuit, 1 TypeScript SDK on GitHub. Server-side validation models are proprietary—open protocol for trust, private defense for security.",
    href: "https://github.com/entros-protocol",
  },
  {
    icon: "globe",
    name: "Integration Targets",
    description: "Mapped Solana ecosystem fit.",
    detail:
      "Sequenced outreach plan covers Jupiter, Drift, 8004 Labs, Metaplex, Realms-using DAOs, Marinade, Tensor, Magic Eden, and Phantom—each with a specific integration angle. Goal: one signed-up integrator pilot before mainnet.",
    href: "/solutions",
  },
  {
    icon: "zap",
    name: "Devnet Live",
    description: "Programs deployed and accepting requests.",
    detail:
      "Full test suite passing across all repos. Verification pipeline operational on Solana devnet.",
    href: "/verify",
  },
];
