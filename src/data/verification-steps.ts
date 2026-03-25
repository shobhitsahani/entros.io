import type { VerificationStep } from "./types";

export const verificationSteps: VerificationStep[] = [
  {
    title: "01 — Challenge",
    description:
      "A random nonsense phrase and Lissajous curve generated fresh for each session. No two sessions share the same challenge.",
    detail:
      "Each session generates a unique phrase from phonetic syllables and a unique Lissajous curve from random mathematical parameters. The user speaks the phrase while tracing the curve for 12 seconds. The challenge elicits natural behavioral data (voice prosody, hand tremor, touch pressure) rather than testing memory or speed.",
    icon: "mic",
  },
  {
    title: "02 — Capture",
    description:
      "Three sensor streams record in parallel: voice, touch, and motion. 12 seconds of simultaneous behavioral data.",
    detail:
      "The Pulse SDK accesses the device microphone, accelerometer, gyroscope, and touch digitizer. All sensors record in parallel for 12 seconds. Raw data stays in device memory and never reaches a network interface. On desktop, motion sensors are unavailable. Mouse pointer dynamics provide equivalent kinematic features.",
    icon: "activity",
  },
  {
    title: "03 — Extract + Score",
    description:
      "Speaker features (F0, jitter, shimmer, HNR, formants), jerk analysis, statistical condensing. Plus entropy scoring to detect synthetic data.",
    detail:
      "Audio: fundamental frequency, vocal jitter, shimmer, harmonics-to-noise ratio, and formant ratios. Per-feature entropy detects TTS artifacts. Motion and touch: jerk and jounce analysis with jitter variance scoring. Real human tremor fluctuates over time, synthetic data stays constant. On desktop, mouse dynamics replace motion sensor data.",
    icon: "scan",
  },
  {
    title: "04 — Hash",
    description:
      "SimHash projects features into a 256-bit fingerprint. Same-user fingerprints cluster; imposters diverge.",
    detail:
      "The expanded feature vector (including entropy and jitter metrics) is passed through SimHash using random hyperplane projections. The output is a Temporal Fingerprint. Two fingerprints from the same person have small Hamming distance. The entropy features mean synthetic data produces a different fingerprint than real behavioral data.",
    icon: "hash",
  },
  {
    title: "05 — Commit",
    description:
      "Poseidon(fingerprint || salt) produces the TBH commitment. The fingerprint and salt stay on-device.",
    detail:
      "A large cryptographically-secure salt is generated. The Poseidon hash function (chosen for ZK-circuit efficiency over BN254 field elements) takes the fingerprint concatenated with the salt to produce H_TBH. The commitment and ZK proof are transmitted. The fingerprint and salt remain on-device, encrypted.",
    icon: "lock",
  },
  {
    title: "06 — Prove",
    description:
      "Groth16 ZK proof: distance is within the valid range. Not too similar (replay), not too different (imposter).",
    detail:
      "The proof verifies three statements: both commitments are valid Poseidon hashes of real fingerprints, the Hamming distance falls below the maximum threshold (natural human variation), and the distance exceeds a minimum threshold (blocks perfect replay where a bot submits identical data). The verifier learns nothing about the actual fingerprints.",
    icon: "proof",
  },
  {
    title: "07 — Verify",
    description:
      "Proof verified on Solana. Anchor updated. Progressive Trust Score recalculated from verification history.",
    detail:
      "The proof is submitted via the IAM relayer (walletless) or the user's wallet (wallet-connected). The verifier checks the Groth16 proof on-chain. On success, the Anchor stores the verification timestamp in a rolling history. Trust Score recalculates using recency weighting and regularity analysis — consistent verifications over weeks score higher than rapid bursts.",
    icon: "check-circle",
  },
];
