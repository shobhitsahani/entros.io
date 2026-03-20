import type { PrivacyGuarantee } from "./types";

export const privacyGuarantees: PrivacyGuarantee[] = [
  {
    icon: "smartphone",
    title: "On-device processing",
    description:
      "Sensor capture, feature extraction, hashing, and proof generation all run on the user's phone. No server computes on biometric data.",
  },
  {
    icon: "database",
    title: "No biometric storage",
    description:
      "Raw audio, motion, and touch data are destroyed after the Temporal Fingerprint is computed. No database holds voice samples or movement traces.",
  },
  {
    icon: "file-lock",
    title: "ZK proof is the only output",
    description:
      "The Pulse SDK transmits a Groth16 proof and a Poseidon commitment. The fingerprint, salt, and raw sensor data never cross the network.",
  },
  {
    icon: "eye-off",
    title: "No identity mapping",
    description:
      "The protocol proves 'you are human,' not 'you are a specific person.' The TBH is pseudonymous. It does not link to a name, email, or social account.",
  },
  {
    icon: "lock",
    title: "One-way commitment",
    description:
      "Poseidon(fingerprint || salt) is computationally irreversible. The commitment cannot be decoded back into the original behavioral fingerprint.",
  },
  {
    icon: "shield",
    title: "GDPR and EU AI Act aligned",
    description:
      "Behavioral verification (not identification) falls outside the strictest AI Act categories. Data minimization is guaranteed by architecture, not policy.",
  },
];
