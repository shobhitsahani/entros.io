import type { Feature } from "./types";

export const features: Feature[] = [
  {
    icon: "pulse",
    title: "The Pulse",
    description:
      "7 seconds of voice, motion, and touch. Hashed on-device, then destroyed.",
    benefit:
      "Deepfake-resistant liveness without storing biometrics.",
  },
  {
    icon: "proof",
    title: "The Proof",
    description:
      "A ZK proof that you're the same human as last time. No biometric data crosses the wire.",
    benefit:
      "Groth16 proof verified on-chain in under 200K compute units.",
  },
  {
    icon: "anchor",
    title: "The Anchor",
    description:
      "A non-transferable Solana token. This wallet belongs to a verified human.",
    benefit:
      "SPL Token-2022 with NonTransferable extension. One per wallet.",
  },
];
