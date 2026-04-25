import type { UseCase } from "./types";

export const useCases: UseCase[] = [
  {
    icon: "airdrop",
    title: "Sybil-Resistant Airdrops",
    problem:
      "Wallet farmers claim thousands of allocations meant for real users.",
    solution:
      "Gate claims on Trust Score. Farming requires sustained behavioral verification per wallet.",
  },
  {
    icon: "vote",
    title: "Verified Governance",
    problem:
      "DAO governance where bots and dormant wallets vote without a human present.",
    solution:
      "Verified humans only. Token-weighted governance with a liveness gate.",
  },
  {
    icon: "bot",
    title: "Bot-Free Platforms",
    problem:
      "Social feeds, marketplaces, and games overrun by automated accounts.",
    solution:
      "Require Entros verification at signup. Kill bots without killing privacy.",
  },
];
