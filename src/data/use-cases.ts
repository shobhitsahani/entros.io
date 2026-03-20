import type { UseCase } from "./types";

export const useCases: UseCase[] = [
  {
    icon: "airdrop",
    title: "Sybil-Proof Airdrops",
    problem:
      "Wallet farmers claim thousands of allocations meant for real users.",
    solution:
      "One claim per verified human. No farming. No multi-accounting.",
  },
  {
    icon: "vote",
    title: "One-Person-One-Vote",
    problem:
      "DAO governance where whales with 50 wallets outvote communities.",
    solution:
      "One human, one vote. Token-weighted governance with a humanity gate.",
  },
  {
    icon: "bot",
    title: "Bot-Free Platforms",
    problem:
      "Social feeds, marketplaces, and games overrun by automated accounts.",
    solution:
      "Require IAM verification at signup. Kill bots without killing privacy.",
  },
];
