import type { VerificationStep } from "./types";

export const verificationSteps: VerificationStep[] = [
  {
    title: "01 — Challenge",
    description:
      "User speaks a phonetically-balanced nonsense phrase and traces a gesture on screen.",
    detail:
      "The phrase is randomly generated and non-sensical (e.g., 'Oro rura lamo ree see') to prevent dictionary-based deepfake attacks. The gesture is a continuous 2D curve. Together they form a Liveness Interlock that captures involuntary behavioral signals.",
    icon: "mic",
  },
  {
    title: "02 — Capture",
    description:
      "Three sensor streams record simultaneously: audio at 16kHz, motion (IMU) at 100Hz, touch at 120Hz.",
    detail:
      "The Pulse SDK accesses the device microphone, accelerometer, gyroscope, and touch digitizer. All three streams capture data during the session. The raw data stays in memory on the device and never touches a network interface.",
    icon: "activity",
  },
  {
    title: "03 — Extract",
    description:
      "MFCCs from audio. Jerk and jounce from motion. Fractal dimension from touch. Statistical condensing.",
    detail:
      "Audio features: 13 MFCC coefficients per 25ms frame, plus delta and delta-delta. Motion and touch: 3rd-derivative (jerk) and 4th-derivative (jounce) analysis, Higuchi fractal dimension. Each stream is condensed to a fixed-length vector via mean, variance, skewness, and kurtosis.",
    icon: "scan",
  },
  {
    title: "04 — Hash",
    description:
      "SimHash projects features into a bitstring. Same-user fingerprints cluster; imposters diverge.",
    detail:
      "The feature vectors are concatenated and passed through SimHash, a locality-sensitive hashing algorithm that uses random hyperplane projections. The output is a Temporal Fingerprint (F_T). Two F_T values from the same person have small Hamming distance. An imposter's F_T lands far away in Hamming space.",
    icon: "hash",
  },
  {
    title: "05 — Commit",
    description:
      "Poseidon(fingerprint || salt) produces the TBH commitment. The fingerprint and salt stay on-device.",
    detail:
      "A large cryptographically-secure salt is generated. The Poseidon hash function (chosen for ZK-circuit efficiency over BN254 field elements) takes the fingerprint concatenated with the salt to produce H_TBH. This commitment is the only value that leaves the device. The raw fingerprint and salt remain private.",
    icon: "lock",
  },
  {
    title: "06 — Prove",
    description:
      "Groth16 ZK proof: 'My new TBH is within Hamming distance t of my previous TBH.' Generated on-device.",
    detail:
      "The user's device generates a Groth16 proof that verifies three things: the new commitment was built from a valid fingerprint, the previous commitment was built from a valid fingerprint, and the Hamming distance between the two fingerprints falls below the protocol threshold. The verifier learns nothing about the actual fingerprints.",
    icon: "proof",
  },
  {
    title: "07 — Verify",
    description:
      "Proof submitted to Solana. Verified in under 200K compute units. Anchor updated. Trust Score increases.",
    detail:
      "The proof and public inputs are submitted via the IAM relayer (walletless mode) or the user's wallet (wallet-connected mode). The iam-verifier program checks the Groth16 proof on-chain. On success, the iam-registry updates the user's IAM Anchor: verification_count increments, last_verification_timestamp refreshes, and Trust Score recalculates.",
    icon: "check-circle",
  },
];
