export interface FlyWheelStep {
  step: string;
  description: string;
}

export interface TokenAllocation {
  name: string;
  percentage: number;
  vesting: string;
}

export interface TokenUtility {
  title: string;
  description: string;
}

export const protocolFee = {
  amount: "~0.005 SOL",
  destination: "Protocol treasury PDA",
  description:
    "Every verification deposits a small protocol fee into an on-chain treasury PDA. The fee is configurable by the protocol admin and auditable by anyone on Solana Explorer.",
};

export const flywheel: FlyWheelStep[] = [
  {
    step: "User verifies",
    description:
      "User pays ~0.005 SOL protocol fee per verification. The fee is included in the same transaction as the ZK proof—one signature, one prompt.",
  },
  {
    step: "Treasury collects",
    description:
      "Fees accumulate in the protocol treasury PDA on-chain. Transparent, auditable, no off-chain billing.",
  },
  {
    step: "Treasury buys Entros",
    description:
      "Protocol revenue is used to purchase Entros tokens on the open market, creating sustained buy pressure proportional to verification volume.",
  },
  {
    step: "Validators earn",
    description:
      "Entros tokens are distributed as staking rewards to validators who run the server-side validation service, incentivizing honest and high-quality validation.",
  },
  {
    step: "Security improves",
    description:
      "More validators and better validation attract more integrations, driving more verifications and more revenue. The flywheel compounds.",
  },
];

export const tokenDistribution: TokenAllocation[] = [
  {
    name: "Community",
    percentage: 30,
    vesting: "10% rolling-wave airdrops, 20% staking and usage emissions over 4 years",
  },
  {
    name: "Treasury",
    percentage: 25,
    vesting: "Bi-weekly unlocks over 4 years, DAO-governed (includes 5% insurance pool + 5% emergency reserve)",
  },
  {
    name: "Team & Contributors",
    percentage: 18,
    vesting: "48-month linear, 12-month cliff, bi-weekly post-cliff",
  },
  {
    name: "Ecosystem Grants",
    percentage: 13,
    vesting: "36-month linear, bi-weekly unlocks",
  },
  {
    name: "Validator Rewards",
    percentage: 7,
    vesting: "On-chain reward pool, 4-year emission",
  },
  {
    name: "Initial Liquidity",
    percentage: 7,
    vesting: "Unlocked at genesis",
  },
];

export const tokenUtilities: TokenUtility[] = [
  {
    title: "Validator Staking",
    description:
      "Stake Entros to run a validation node in the server-side verification network. Staked validators earn protocol fees proportional to their stake and performance.",
  },
  {
    title: "Governance",
    description:
      "Vote on protocol parameters: verification fee amount, Trust Score formula weights, threshold values, treasury allocation. One token, one vote.",
  },
  {
    title: "Capacity Tiers",
    description:
      "Large integrators can stake Entros tokens for priority access and reduced fees, replacing per-verification costs with a staking model at scale.",
  },
];

export const launchDetails = {
  mechanism: "MetaDAO or curated community sale",
  airdrop:
    "First airdrop exclusively to Entros-verified humans. Your Trust Score determines allocation—the protocol rewards real users, not bot farms.",
  standard: "SPL Token-2022 with Confidential Balances",
  supply: "Fixed at genesis",
};
