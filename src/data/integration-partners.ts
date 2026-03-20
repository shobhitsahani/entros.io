import type { IntegrationPartner } from "./types";

export const integrationPartners: IntegrationPartner[] = [
  {
    name: "Jupiter",
    category: "DeFi",
    description: "Sybil-resistant airdrops and governance participation.",
    icon: "airdrop",
    logoUrl: "https://github.com/jup-ag.png",
  },
  {
    name: "Marinade",
    category: "DeFi / DAO",
    description: "One-person-one-vote for MNDE governance proposals.",
    icon: "vote",
    logoUrl: "https://github.com/marinade-finance.png",
  },
  {
    name: "Tensor",
    category: "NFT",
    description: "Fair mint allocations and verified trader competitions.",
    icon: "gamepad",
    logoUrl: "https://github.com/tensor-foundation.png",
  },
  {
    name: "Drift",
    category: "DeFi",
    description: "Bot-free trading competitions with Anchor age requirements.",
    icon: "chart",
    logoUrl: "https://github.com/drift-labs.png",
  },
  {
    name: "Realms",
    category: "DAO Framework",
    description: "Quadratic voting backed by human-verified identity.",
    icon: "users",
    logoUrl: "https://github.com/solana-labs.png",
  },
  {
    name: "Metaplex",
    category: "NFT Infrastructure",
    description: "Creator verification and provenance for NFT collections.",
    icon: "palette",
    logoUrl: "https://github.com/metaplex-foundation.png",
  },
  {
    name: "DRiP",
    category: "Social",
    description: "Referral reward gating to eliminate bot farming.",
    icon: "bot",
  },
  {
    name: "Helium",
    category: "DePIN",
    description: "Unique operator verification for hotspot networks.",
    icon: "globe",
    logoUrl: "https://github.com/helium.png",
  },
];
