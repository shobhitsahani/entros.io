export interface TrustSignal {
  icon: string;
  name: string;
  description: string;
  href: string;
  cta: string;
  gridArea: string;
}

export const trustSignals: TrustSignal[] = [
  {
    icon: "shield",
    name: "Security Audit",
    description: "Scheduled for mainnet launch. Programs built with Anchor constraints and PDA validation.",
    href: "/technology",
    cta: "Learn more",
    gridArea: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    icon: "github",
    name: "Open Source",
    description: "Protocol core, circuits, and SDK are open source. Verify the code yourself.",
    href: "https://github.com/iam-protocol",
    cta: "View on GitHub",
    gridArea: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4",
  },
  {
    icon: "globe",
    name: "Integration Partners",
    description: "Targeting Jupiter, Marinade, Tensor, Drift, and Realms for devnet pilot.",
    href: "/solutions",
    cta: "See use cases",
    gridArea: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    icon: "zap",
    name: "Devnet Live",
    description: "Protocol in active development. Programs deployed and passing integration tests.",
    href: "/verify",
    cta: "Try it now",
    gridArea: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-4",
  },
];
