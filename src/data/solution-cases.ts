import type { SolutionCase } from "./types";

export const solutionCases: SolutionCase[] = [
  {
    icon: "airdrop",
    title: "Sybil-Proof Airdrops",
    category: "DeFi",
    problem:
      "Jupiter's 2024 airdrop was farmed by bot networks. In one presale, 1,100 of 1,530 wallets belonged to a single entity.",
    solution:
      "Gate airdrop claims on IAM Anchor with a minimum Trust Score (e.g., 50+). Trust Score requires weeks of consistent re-verification, making bot farming slow and expensive. Progressive scoring means 100 verifications in one day scores less than weekly verifications over 3 months.",
    example:
      "Jupiter gates JUP claims with IAM. Each wallet needs Trust Score 50+ (roughly 8 weeks of regular verification). Farming one identity costs time; farming thousands costs months of sustained bot operation.",
  },
  {
    icon: "vote",
    title: "One-Person-One-Vote",
    category: "DAOs",
    problem:
      "DAO governance where a whale with 1,000 wallets outvotes an entire community. Token-weighted voting amplifies concentration.",
    solution:
      "Voters must hold an IAM Anchor with minimum Trust Score. Each human gets one vote per verified wallet. The minimum distance constraint prevents bot replay, and entropy scoring flags synthetic behavioral data.",
    example:
      "Realms adds an IAM gate to proposal voting. MNDE holders still submit proposals, but vote weight is capped at 1x per verified human with Trust Score 30+.",
  },
  {
    icon: "gamepad",
    title: "Fair Mints and Competitions",
    category: "Gaming",
    problem:
      "NFT drops are exploited by farms. Trading competitions are gamed by wash-trading bots operating across hundreds of accounts.",
    solution:
      "Mint gate: one human per allocation, verified by Anchor. Competition entry: require Anchor age > 30 days and recent verification. Short-lived bot accounts with zero trust cannot qualify. Each verification costs $0.01, making large-scale bot farming economically punitive.",
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
      "Creators register with an IAM Anchor. Collection metadata includes a cryptographic commitment to the creator's Anchor. Buyers verify provenance on-chain. The Anchor's Trust Score signals how long the creator has maintained their verified identity.",
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
      "Require IAM verification at account creation or reward claim. Entropy scoring and minimum Hamming distance constraints detect the synthetic inputs that scripted bots produce. Walletless mode works as a drop-in captcha replacement for web platforms.",
    example:
      "DRiP gates referral rewards on IAM Anchors. Helium requires hotspot operators to prove unique humanity, preventing one entity from running thousands of nodes.",
  },
];
