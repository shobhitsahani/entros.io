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
      "Token-weighted governance is plutocracy by default. A wealthy attacker can ratify their own theft (Mango 2022) or spam-clear quorum with self-funded proposals.",
    solution:
      "Realms voter-weight plugin gates voting on verified-personhood Trust Score, not token holdings. One human, one vote—verified behaviorally on any device.",
  },
  {
    icon: "bot",
    title: "Bot-Free Platforms",
    problem:
      "Social feeds, marketplaces, and games overrun by automated accounts.",
    solution:
      "Require Entros verification at signup. Filter bots without collecting identity or hardware data.",
  },
];
