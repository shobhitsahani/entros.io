import type { SolutionCase } from "./types";

export const solutionCases: SolutionCase[] = [
  {
    icon: "airdrop",
    title: "Sybil-Resistant Airdrops",
    category: "DeFi",
    problem:
      "Jupiter's 2024 airdrop was farmed by bot networks. In one presale, 1,100 of 1,530 wallets belonged to a single entity.",
    solution:
      "Gate airdrop claims on Entros Anchor with a minimum Trust Score (e.g., 50+). Trust Score requires weeks of consistent re-verification, making bot farming slow and expensive. Progressive scoring means 100 verifications in one day scores less than weekly verifications over 3 months.",
    example:
      "Jupiter gates JUP claims with Entros. Each wallet needs Trust Score 200+ (at least two re-verifications with recent history). Farming one identity costs time; farming thousands costs months of sustained bot operation.",
  },
  {
    icon: "vote",
    title: "Verified Governance",
    category: "DAOs",
    problem:
      "DAO governance where bots, scripts, and dormant wallets vote without a human present. No liveness check at the moment of voting.",
    solution:
      "Voters must hold an Entros Anchor with minimum Trust Score and recent verification. The voter weight plugin checks liveness before every governance action. Bots and automated scripts are excluded.",
    example:
      "Realms adds an Entros liveness gate to proposal voting. MNDE holders still submit proposals, but voters must prove human presence with Trust Score 100+ and verification within the last 30 days.",
  },
  {
    icon: "gamepad",
    title: "Fair Mints and Competitions",
    category: "Gaming",
    problem:
      "NFT drops are exploited by farms. Trading competitions are gamed by wash-trading bots operating across hundreds of accounts.",
    solution:
      "Mint gate: one human per allocation, verified by Anchor. Competition entry: require Anchor age > 30 days and recent verification. Short-lived bot accounts with zero trust cannot qualify. Each verification costs the user SOL, making large-scale bot farming economically punitive.",
    example:
      "Tensor requires Entros verification for mint allowlists. Drift trading competitions check Anchor age and Trust Score at entry.",
  },
  {
    icon: "palette",
    title: "Creator Verification",
    category: "Creators",
    problem:
      "Scammers mint NFT collections under stolen brands. Buyers cannot distinguish real creators from impersonators.",
    solution:
      "Creators register with an Entros Anchor. Collection metadata includes a cryptographic commitment to the creator's Anchor. Buyers verify provenance on-chain. The Anchor's Trust Score signals how long the creator has maintained their verified identity.",
    example:
      "Metaplex collections include an Entros Anchor reference in metadata. Marketplaces display a 'Verified Creator' badge for Anchored artists.",
  },
  {
    icon: "bot",
    title: "Bot Prevention",
    category: "Social",
    problem:
      "Referral platforms and decentralized networks are overrun by bot accounts farming rewards and inflating metrics.",
    solution:
      "Require Entros verification at account creation or reward claim. Entropy scoring and minimum Hamming distance constraints detect the synthetic inputs that scripted bots produce. Walletless mode works as a drop-in captcha replacement for web platforms.",
    example:
      "DRiP gates referral rewards on Entros Anchors. Helium requires hotspot operators to prove human operation, raising the cost of running bot networks.",
  },
];
