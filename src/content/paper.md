# IAM Protocol: Proof-of-Humanity through Temporal Biometric Consistency

**Version:** 3.0
**Date:** March 25, 2026

---

#### Abstract

This paper presents the IAM Protocol, a decentralized Proof-of-Humanity framework built on Solana. The protocol proves humanness through temporal consistency: the observation that a person's behavioral signature (voice prosody, hand tremor, touch dynamics) varies within a bounded range across sessions, while synthetic or replayed data falls outside that range. During each verification, the user's device captures multi-modal sensor data, extracts a 134-dimensional feature vector, and compresses it into a 256-bit Temporal Fingerprint via SimHash. A Groth16 zero-knowledge proof demonstrates that the Hamming distance between the current fingerprint and a previous one falls within an acceptable range, without revealing either fingerprint. The proof is verified on-chain by a Solana program. Successful verifications update a non-transferable identity token (the IAM Anchor) with a progressive Trust Score that rewards consistent re-verification over time. The protocol requires no wallet, no payment, and no crypto knowledge from the end user. Raw biometric data never leaves the device.

**Keywords:** Proof-of-Humanity, Behavioral Biometrics, Zero-Knowledge Proofs, Groth16, SimHash, Temporal Consistency, Solana, Decentralized Identity.

---

### 1. Introduction

Sybil attacks cost Solana protocols hundreds of millions of dollars annually. A single adversary creates thousands of wallet addresses to claim airdrops, manipulate DAO votes, or extract MEV. Existing defenses fall into three categories: static biometrics (Worldcoin's iris scanning), social graph analysis (BrightID), and CAPTCHA-style cognitive tests (hCaptcha). Each has a structural weakness. Static biometrics create permanent identifiers that cannot be revoked if compromised. Social graphs are vulnerable to collusion. Cognitive tests are solved by modern AI systems.

The IAM Protocol takes a different approach. A human is a continuous dynamic process, not a static data point. Voice prosody shifts between utterances. Hand tremor varies with fatigue. Touch pressure changes with posture. These micro-variations follow a bounded pattern unique to each person. A bot can mimic a single sample, but producing consistent temporal drift across multiple sessions requires modeling the full complexity of human neuromuscular control.

The protocol exploits this property through three mechanisms:

1. **The Temporal-Biometric Hash (TBH):** A 256-bit fingerprint derived from voice, motion, and touch features captured during a 12-second behavioral challenge.
2. **ZK Self-Proof:** A Groth16 zero-knowledge proof that the Hamming distance between the current and previous TBH is within a valid range, without revealing either value.
3. **The IAM Anchor:** A non-transferable on-chain identity token with a progressive Trust Score that increases with consistent re-verification.

Users verify through a web browser. The proof is submitted to Solana via a relayer service funded by the integrating application. The user needs no wallet, no SOL, and no understanding of cryptography.

---

### 2. The Temporal-Biometric Hash

#### 2.1 Data Acquisition

Each verification session presents the user with a unique challenge: a randomly generated nonsense phrase and a Lissajous curve to trace on screen. The challenge elicits involuntary behavioral signatures rather than testing cognitive ability. A bot cannot precompute responses for an unknown prompt.

Three data streams are captured simultaneously:

- **Audio** (`S_audio`): Captured at 16kHz (or the device's native rate on iOS). Focuses on prosody, not speech content.
- **Motion** (`S_motion`): IMU accelerometer and gyroscope data at the device's native rate (60-100Hz). On desktop devices without an IMU, mouse pointer dynamics substitute.
- **Touch** (`S_touch`): Pointer events (coordinates, pressure, contact area) from the user's finger or cursor.

#### 2.2 Feature Extraction

Raw sensor data is distilled into a 134-dimensional feature vector through three parallel extraction pipelines.

**Speaker features (44 dimensions).** The audio stream yields: fundamental frequency (F0) statistics and delta, jitter measures (local, RAP, PPQ5, DDP), shimmer measures (local, APQ3, APQ5, DDA), harmonics-to-noise ratio (HNR) statistics, formant frequency ratios (F1/F2, F2/F3) via LPC analysis, long-term average spectrum (LTAS) statistics (spectral centroid, rolloff, flatness, spread), voicing ratio, and amplitude statistics with entropy. These features characterize the physiological properties of the vocal tract and are stable within a speaker but vary across individuals.

Each speaker feature presents a distinct challenge to synthesis. F0 is trivial to match with text-to-speech engines. Formant ratios encode vocal tract geometry specific to each person. Jitter and shimmer measure involuntary micro-perturbations in pitch period and amplitude that TTS engines produce with unnaturally low or uniform values. HNR catches synthetic audio because TTS produces unnaturally clean signals without the breath noise present in real speech.

**Kinematic features (54 dimensions).** On mobile devices with IMU and touch data available, pointer dynamics from finger tracing provide the kinematic features: path curvature, directional entropy, speed and acceleration profiles, jerk magnitude, micro-correction frequency, pause ratios, path efficiency, segment lengths, speed jitter variance, normalized path length, and angle autocorrelation. On desktop (no IMU), mouse pointer dynamics fill this role. Finger tracing has natural inter-session variance because no two paths are identical.

**Touch features (36 dimensions).** Touch coordinate velocity and acceleration, pressure statistics, contact area statistics, path jerk, and per-signal jitter variance. These capture the fine motor control patterns of the user's interaction with the screen.

**Feature fusion.** Each modality group is independently normalized to zero mean and unit variance (z-score normalization) before concatenation. This ensures each group contributes equally to the SimHash projection regardless of raw magnitude differences. A NaN sanitization step replaces any non-finite values with zero before normalization, preventing a single degenerate feature from poisoning the entire group.

#### 2.3 SimHash Fingerprinting

The 134-dimensional fused feature vector is compressed into a 256-bit Temporal Fingerprint (`F_T`) using SimHash, a locality-sensitive hashing algorithm. SimHash projects the feature vector onto 256 deterministic random hyperplanes (seeded from a fixed constant for reproducibility). Each bit of the fingerprint is the sign of the dot product between the feature vector and one hyperplane.

Two fingerprints from the same person across different sessions will have a small Hamming distance (typically 20-65 bits out of 256 in our testing). Two fingerprints from different people will have a distance near 128 (random). A replayed fingerprint will have distance 0 (identical).

#### 2.4 Cryptographic Commitment

The Temporal Fingerprint is private. To create a verifiable commitment without revealing the fingerprint, we compute:

```
H_TBH = Poseidon(pack_lo(F_T), pack_hi(F_T), salt)
```

The fingerprint's 256 bits are packed into two 128-bit BN254 field elements. A cryptographically random 248-bit salt is generated per session. Poseidon is chosen for its efficiency inside ZK-SNARK circuits. The commitment `H_TBH` and salt are the outputs. The raw fingerprint `F_T` remains on the device.

---

### 3. ZK Verification

#### 3.1 The Hamming Distance Circuit

Re-verification requires proving that the current fingerprint is similar to (but not identical to) the previous one, without revealing either. We implement this as a Groth16 circuit (BN254 curve, ~1,996 constraints) that proves three statements:

1. `Poseidon(pack(F_T_new), salt_new) == commitment_new`
2. `Poseidon(pack(F_T_prev), salt_prev) == commitment_prev`
3. `min_distance <= HammingDistance(F_T_new, F_T_prev) < threshold`

**Public inputs:** `commitment_new`, `commitment_prev`, `threshold`, `min_distance`
**Private witnesses:** `F_T_new[256]`, `F_T_prev[256]`, `salt_new`, `salt_prev`

The minimum distance constraint (`min_distance = 3`) prevents exact replay attacks. The threshold constraint (`threshold = 96`) rejects fingerprints from different people. The circuit computes Hamming distance via bitwise XOR and popcount, all expressed as R1CS constraints verified by the Groth16 verifier.

#### 3.2 Proof Generation and On-Chain Verification

Proof generation runs client-side in the browser using snarkjs (WASM). Proving takes under 1 second on modern hardware. The proof is serialized into 256 bytes (proof_a + proof_b + proof_c in the groth16-solana format) with 4 public inputs (32 bytes each).

On-chain verification uses the `groth16-solana` crate, which implements the BN254 pairing check within Solana's compute budget (<200K compute units). The verification program:

1. Validates a challenge nonce (anti-replay, single-use, time-limited)
2. Runs the Groth16 pairing check
3. If valid, creates a VerificationResult PDA as an audit trail
4. If invalid, reverts the entire transaction (challenge nonce preserved for retry)

#### 3.3 Trusted Setup

The Groth16 circuit requires a structured reference string produced by a trusted setup ceremony. Phase 1 uses the Hermez community Powers of Tau ceremony (multi-contributor, production-grade, circuit-agnostic). Phase 2 currently has a single contributor with entropy from system randomness. A multi-party computation ceremony with 10+ independent contributors will precede mainnet deployment. The toxic waste is compromised only if all contributors collude.

---

### 4. The IAM Anchor

#### 4.1 On-Chain Identity

Each verified user receives a non-transferable identity token implemented as an SPL Token-2022 mint with the NonTransferable extension. The token is a Program Derived Address (PDA) derived from the user's wallet public key, enforcing a one-to-one mapping between wallets and identities.

The identity state stores:

| Field | Type | Purpose |
|-------|------|---------|
| `owner` | Pubkey | Wallet that controls this identity |
| `creation_timestamp` | i64 | When the identity was first minted |
| `last_verification_timestamp` | i64 | Most recent successful verification |
| `verification_count` | u32 | Total successful verifications |
| `trust_score` | u16 | Progressive reputation metric |
| `current_commitment` | [u8; 32] | Latest Poseidon commitment |
| `recent_timestamps` | [i64; 10] | Rolling window for Trust Score computation |

#### 4.2 Progressive Trust Score

The Trust Score rewards consistency over time, not rapid repetition. A bot verifying 100 times in one day scores lower than a human verifying weekly for months.

The formula combines three components:

1. **Recency-weighted verification count.** Each of the last 10 verification timestamps contributes `3000 / (30 + days_since)` to a recency score with a 30-day half-life. This is multiplied by a base increment from the protocol config.

2. **Regularity bonus.** The standard deviation of gaps between consecutive verifications is computed. Lower variance (more regular spacing) yields a higher bonus, up to 20 points. Irregular bursts score zero.

3. **Age bonus.** `isqrt(min(age_days, 365)) * 2`, where `isqrt` is deterministic integer square root (Newton's method, no floating point). Diminishing returns prevent gaming via old unused accounts.

The score is capped at a protocol-configurable maximum (currently 10,000). Trust Score computation happens on-chain inside the `update_anchor` instruction, reading protocol parameters from a cross-program PDA. The caller cannot set an arbitrary score.

#### 4.3 Walletless Mode

The default verification flow requires no wallet. The user visits a website that embeds the Pulse SDK, completes a 12-second behavioral challenge, and receives a verification result. The ZK proof is submitted to a relayer service that builds and signs the on-chain transaction using funds from the integrating application's escrow deposit. The user's biometric fingerprint is stored locally (encrypted with AES-256-GCM, key in IndexedDB) for future re-verification.

Wallet-connected mode exists for DeFi and DAO users who want self-custody. The user signs the verification transaction directly, mints their IAM Anchor, and builds an on-chain Trust Score.

---

### 5. Economic Model

#### 5.1 Participants

The protocol has three participant classes:

**Users** pay nothing. Walletless mode requires no wallet, no SOL, no crypto knowledge. The integrating application funds the verification.

**Integrators** (websites, protocols, dApps) deposit SOL or USDC into a protocol escrow to purchase verification capacity at approximately $0.01 per verification. The protocol retains roughly 70% margin after Solana transaction costs ($0.003 per transaction). This is 10x cheaper than the cost of a single Sybil attack on an airdrop.

**Validators** stake the IAM utility token to participate in the Anonymity Ring. Validators are selected via Switchboard VRF for each verification request. They issue challenge nonces, relay attestations, and earn staking rewards from protocol revenue.

#### 5.2 Revenue Cycle

Integrator fees flow to the protocol treasury. The treasury buys IAM tokens on the open market and distributes them to active validators as staking rewards. This creates buy pressure proportional to real verification volume.

#### 5.3 Slashing

A probabilistic audit mechanism (0.5% of verifications) triggers secondary verification by an independent ring. If the primary ring approved a fraudulent verification, all ring members lose their staked tokens. Non-participation incurs progressive micro-slashing. Validators can unstake and recover their full stake when not under investigation.

---

### 6. Security Analysis

#### 6.1 Replay Attacks

The ZK circuit enforces `min_distance >= 3`. An exact replay (distance 0) or near-replay (distance 1-2) is rejected at the proof level. Challenge nonces are single-use and time-limited (5 minutes). A replayed proof with a consumed nonce fails before reaching the verifier.

#### 6.2 Synthetic Data

A bot must simultaneously fake voice prosody, motion dynamics, and touch pressure across 12 seconds of parallel capture. Spoofing one modality is feasible. Spoofing all three with consistent behavioral entropy is not. The 134-dimensional feature vector projects through SimHash into a 256-bit fingerprint where each bit depends on all modalities combined. TTS engines produce unnaturally low jitter and shimmer values. Scripted mouse movement lacks the directional entropy and micro-correction patterns of real cursor paths.

#### 6.3 Sybil Attacks

Each wallet maps to exactly one IAM Anchor (PDA derived from wallet public key). Creating multiple identities requires multiple wallets with independent behavioral profiles sustained across re-verifications. The Trust Score penalizes new accounts and irregular verification patterns. The economic cost of maintaining many fake identities with consistent behavioral drift exceeds the value extractable from most Sybil attacks.

#### 6.4 Privacy

Raw biometric data never leaves the user's device. The ZK proof is the only output. The biometric fingerprint stored locally for re-verification is encrypted with AES-256-GCM using a non-extractable CryptoKey in IndexedDB. On-chain, only the Poseidon commitment (a one-way hash) is stored. The commitment cannot be reversed to recover the fingerprint or any biometric feature.

---

### 7. Implementation Status

The protocol is deployed on Solana devnet with end-to-end verification working in the browser on desktop and mobile.

| Component | Status |
|-----------|--------|
| On-chain programs (Anchor/Rust) | 3 programs deployed on devnet. Access control, on-chain Trust Score, proof revert on failure. |
| ZK circuit (Groth16/Circom) | Hamming distance circuit with min_distance. Trusted setup complete (single contributor, multi-party ceremony before mainnet). |
| Pulse SDK (TypeScript) | Published on npm. Speaker features, kinematic extraction, SimHash, Poseidon commitment, Groth16 proving, encrypted localStorage. |
| Executor node (Rust) | Live on Railway. Relayer API, rate limiting, quota tracking, commitment registry. |
| Demo application (Next.js) | Live on Vercel. Walletless and wallet-connected verification flows. |

52 unit tests cover feature extraction, circuit boundary cases, and the full crypto pipeline. The circuit has been verified manually against the JSON verification key. All programs pass Anchor integration tests.

The Groth16 trusted setup uses a single-contributor Phase 2. A multi-contributor MPC ceremony will precede mainnet deployment. The Phase 1 Powers of Tau uses the Hermez community ceremony.

---

### 8. Related Work

**Worldcoin** uses iris scanning to create a unique biometric identifier per person. The approach requires custom hardware (the Orb), stores a permanent biometric template (the iris code), and has been banned or restricted in 12+ jurisdictions over privacy concerns. IAM captures behavioral signals (not anatomical) that change over time and are processed entirely on-device.

**BrightID** verifies uniqueness through social graph analysis. Users vouch for each other in verification parties. The system is vulnerable to coordinated collusion and requires social coordination that limits adoption.

**Reclaim Protocol** proves ownership of existing web2 accounts via TLS session proofs. It answers "do you control this account?" not "are you human?" IAM and Reclaim are complementary: Reclaim proves account ownership, IAM proves the account owner is a living person.

**hCaptcha** and similar CAPTCHA systems test cognitive ability. Modern AI solves most CAPTCHA variants faster than humans. CAPTCHAs verify task completion, not identity persistence across sessions.

---

### 9. Future Work

**Multi-contributor trusted setup ceremony.** Coordinate 10+ independent contributors for the Groth16 Phase 2 ceremony before mainnet deployment. Publish the full transcript of contributions.

**External security audit.** Engage a Solana-specialized auditing firm to review all on-chain programs, the ZK circuit, and the executor node before mainnet.

**Integrator onboarding.** Build the integration SDK (`verifyHumanity()` wrapper), developer documentation site, and escrow deposit flow. Target pilot integrations with Solana DeFi and DAO protocols.

**IAM utility token.** SPL Token-2022 with Confidential Balances extension. Validator staking, verification capacity tiers, and governance. Distribution: 40% community, 20% ecosystem grants, 15% treasury, 15% team (2-year vest), 10% initial liquidity.

**AudioWorklet migration.** Replace the deprecated ScriptProcessorNode with AudioWorklet for lower-latency audio capture.

**Cross-chain deployment.** Port the verification flow to Ethereum L2s after the Solana mainnet launch stabilizes.

---

### 10. Conclusion

The IAM Protocol proves humanness through temporal biometric consistency. Each verification captures the involuntary behavioral signature of voice, motion, and touch, compresses it into a fingerprint via SimHash, and proves similarity to a previous session via a Groth16 zero-knowledge proof. The raw biometric data stays on the device. The proof is verified on Solana. Trust builds with every re-verification.

The protocol is open source and published as a defensive publication to establish prior art. The source code, circuit definitions, and SDK are available at `github.com/iam-protocol`.

---

### References

[1] Douceur, J. R. "The Sybil Attack." IPTPS, 2002.
[2] Charikar, M. S. "Similarity estimation techniques from rounding algorithms." STOC, 2002.
[3] Grassi, L., et al. "Poseidon: A New Hash Function for Zero-Knowledge Proof Systems." USENIX Security, 2021.
[4] Groth, J. "On the Size of Pairing-Based Non-interactive Arguments." EUROCRYPT, 2016.
[5] Boneh, D., et al. "Verifiable Random Functions." FOCS, 1999.
