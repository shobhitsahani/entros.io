import type { SolutionCase } from "./types";

export const solutionCases: SolutionCase[] = [
  {
    icon: "airdrop",
    title: "Sybil-Proof Airdrops",
    category: "DeFi",
    problem:
      "Jupiter's 2024 airdrop was farmed by bot networks. In one presale, 1,100 of 1,530 wallets belonged to a single entity.",
    solution:
      "Gate airdrop claims on IAM Anchor. One verified human receives one allocation. Repeated claims over time require re-verification, preventing replay farming.",
    example:
      "Jupiter gates JUP claims with IAM. Each wallet must hold an active Anchor (last verification within 7 days) to claim. Farming drops to near zero.",
  },
  {
    icon: "vote",
    title: "One-Person-One-Vote",
    category: "DAOs",
    problem:
      "DAO governance where a whale with 1,000 wallets outvotes an entire community. Token-weighted voting amplifies concentration.",
    solution:
      "Voters must hold an IAM Anchor. Each human gets one vote, regardless of token balance. Quadratic voting becomes meaningful when Sybil wallets are removed.",
    example:
      "Realms adds an IAM gate to proposal voting. MNDE holders still submit proposals, but vote weight is capped at 1x per verified human.",
  },
  {
    icon: "gamepad",
    title: "Fair Mints and Competitions",
    category: "Gaming",
    problem:
      "NFT drops are exploited by farms. Trading competitions are gamed by wash-trading bots operating across hundreds of accounts.",
    solution:
      "Mint gate: one human equals one allocation. Competition entry: require Anchor age > 30 days and last verification < 7 days. Short-lived bot accounts cannot qualify.",
    example:
      "Tensor requires IAM verification for mint allowlists. Drift trading competitions check Anchor age and Trust Score at entry.",
  },
  {
    icon: "palette",
    title: "Creator Verification",
    category: "Creators",
    problem:
      "Scammers mint NFT collections under stolen brands. Buyers cannot distinguish real creators from impersonators.",
    solution:
      "Creators register with an IAM Anchor. Collection metadata includes a cryptographic commitment to the creator's Anchor. Buyers verify provenance on-chain.",
    example:
      "Metaplex collections include an IAM Anchor reference in metadata. Marketplaces display a 'Verified Creator' badge for Anchored artists.",
  },
  {
    icon: "bot",
    title: "Bot Prevention",
    category: "Social",
    problem:
      "Referral platforms and decentralized networks are overrun by bot accounts farming rewards and inflating metrics.",
    solution:
      "Require IAM verification at account creation or reward claim. Bot networks cannot pass the behavioral liveness challenge at scale.",
    example:
      "DRiP gates referral rewards on IAM Anchors. Helium requires hotspot operators to prove unique humanity, preventing one entity from running thousands of nodes.",
  },
];
