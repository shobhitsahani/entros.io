import type { ProtocolComponent } from "./types";

export const protocolComponents: ProtocolComponent[] = [
  {
    icon: "pulse",
    title: "Pulse SDK",
    subtitle: "Client-side capture and proving",
    description:
      "A TypeScript library that runs on the user's phone or browser. It captures sensor data, extracts features, generates the TBH commitment, and produces the ZK proof. The raw biometric data never leaves this library.",
    highlights: [
      "Browser and React Native support",
      "Audio, IMU, and touch capture in parallel",
      "On-device Groth16 proof generation",
      "Walletless mode (relayer) and wallet-connected mode",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/iam-protocol/pulse-sdk" },
      { label: "npm", href: "https://www.npmjs.com/package/@iam-protocol/pulse-sdk" },
    ],
  },
  {
    icon: "proof",
    title: "ZK Circuit",
    subtitle: "Hamming distance verification",
    description:
      "A Groth16 circuit that proves two Poseidon-committed TBH values are within Hamming distance t of each other. The circuit runs at proving time on the user's device. The verifier learns only that the threshold check passed.",
    highlights: [
      "Groth16 over BN254 curve",
      "Poseidon hash for ZK efficiency",
      "Under 200K compute units on-chain",
      "Proof generation targets under 5 seconds on mobile",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/iam-protocol/circuits" },
    ],
  },
  {
    icon: "anchor",
    title: "On-Chain Programs",
    subtitle: "Three Solana programs",
    description:
      "The iam-verifier program checks ZK proofs. The iam-anchor program manages non-transferable identity tokens (SPL Token-2022). The iam-registry tracks Trust Scores, validator staking, and protocol configuration.",
    highlights: [
      "Anchor framework with full constraint validation",
      "Non-transferable token via Token-2022 extension",
      "Trust Score from verification count and age",
      "PDA-derived identity (one per wallet)",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/iam-protocol/protocol-core" },
    ],
  },
  {
    icon: "server",
    title: "Executor Node",
    subtitle: "Off-chain validation service",
    description:
      "A Rust service that listens for on-chain verification events, issues challenges, relays attestations, and manages the Anonymity Ring. Handles walletless transaction submission via the relayer API.",
    highlights: [
      "Solana RPC subscription via geyser/websocket",
      "Challenge issuance and attestation relay",
      "Walletless relayer for integrator-funded transactions",
      "Configurable CORS and rate limiting",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/iam-protocol/executor-node" },
    ],
  },
];
