# IAM Protocol: A Framework for Temporally-Consistent, Decentralized Proof-of-Humanity

**Document Version:** 3.0 (Updated for Solana / ZK Self-Proof Architecture)
**Original Date:** June 27, 2025
**Updated:** March 26, 2026
**Word Count:** Approx. 3200

---

#### **Abstract**

The proliferation of sophisticated AI and bot networks necessitates a robust method for verifying human uniqueness and liveness in digital ecosystems—a concept known as Proof-of-Humanity (PoH). Existing solutions often rely on centralized authorities, invasive static biometrics (e.g., iris scans), or socially-correlatable data, creating significant vulnerabilities in privacy, security, and accessibility. This paper introduces the IAM Protocol, a decentralized framework for PoH and Self-Sovereign Identity (SSI). Its core innovation is the concept of **temporal consistency**, asserting that a human's identity is best proven not by a single secret, but by the dynamic, chaotic, and continuous signature of their biological and behavioral patterns over time. The framework leverages a multi-modal "Liveness Interlock" to generate a **Temporal-Biometric Hash (TBH)**, a 256-bit fingerprint derived from voice prosody, hand tremor, and touch dynamics, which is then verified via a Groth16 zero-knowledge proof on Solana. The resulting attestations are anchored to an evolving, non-transferable identity token (the IAM Anchor), forming a private and secure Decentralized Identity (DID). This paper details the mathematical foundations of the TBH, the cryptographic architecture of the ZK verification mechanism, the game-theoretic incentives underpinning the system's security, and the application layer that brings its utility to the digital world.

**Keywords:** *Proof-of-Humanity (PoH), Decentralized Identity (DID), Behavioral Biometrics, Zero-Knowledge Proofs, Groth16, SimHash, Liveness Detection, Temporal Consistency, Solana.*

---

### **1. Introduction: The Core Philosophy of the IAM Protocol**

The digital landscape is at an inflection point. The distinction between human and artificial actors is increasingly blurred, posing a serious threat to the integrity of online economies, governance models, and social platforms. Sybil attacks, where a single adversary creates numerous fake identities, can undermine everything from fair token distribution (airdrops) and democratic voting in DAOs to the spread of disinformation.

The fundamental flaw in most current PoH systems is their reliance on a single, static biometric "secret" (an iris scan, a palm print). This is analogous to using the same password everywhere. If it's compromised once, it's compromised forever. The IAM Protocol operates on a different principle: **Proof-of-Humanity through Temporal Consistency and Multi-Modal Biometric Hashing.** A human is not a static data point; they are a continuous, dynamic process. The "liveness" of a human has a unique, chaotic, and high-entropy signature over time. AI can mimic a snapshot, but mimicking this temporal signature perfectly is computationally prohibitive.

Instead of asking, *"What is your secret?"*, we ask, *"Are you still you?"*. By focusing on the unique, difficult-to-replicate *dynamics* of human liveness over time, we create a more resilient, private, and equitable foundation for digital identity.

The framework is built on three pillars, which this paper will detail in subsequent sections:

1.  **The Liveness Interlock (The "Pulse"):** A multi-modal, time-series liveness check that generates a temporary, high-entropy Temporal-Biometric Hash, detailed in Section 2.
2.  **ZK Self-Proof (The "Chorus"):** A zero-knowledge proof that the user's current behavioral fingerprint is consistent with their previous one—without revealing either value. Verified on-chain by a Solana program, detailed in Section 3.
3.  **The IAM Anchor (The "Anchor"):** An evolving, non-transferable token that acts as the user's DID, storing cryptographic attestations of their temporal consistency, not their raw data. This is supported by a robust economic model (Section 4) and provides a flexible application layer (Section 5).

---

### **2. Pillar I: Mathematical Modeling of the Temporal-Biometric Hash (TBH)**

#### **2.1. Objective**

To define a deterministic, yet unpredictable, process for converting raw, multi-modal sensor data into a compact, secure, and privacy-preserving cryptographic hash. This process must satisfy the following criteria: High Uniqueness, High Spoof-Resistance, Temporal Consistency, Privacy Preservation, and Computational Efficiency on standard consumer hardware.

#### **2.2. The Liveness Interlock: Data Acquisition Protocol**

The TBH is generated from data captured during the "Liveness Interlock," a user-facing challenge designed to elicit unique behavioral and biological responses.

* **Challenge Generation:** The protocol issues a nonce-seeded challenge consisting of two parts: a phonetically-balanced, non-sensical phrase to be spoken aloud (e.g., *"Oro rura lamo ree see"*) to prevent dictionary-based audio deepfake attacks, and a simple, continuous 2D gesture to be traced on the screen (e.g., a Lissajous curve).
* **Synchronous Data Streams (`S`):**
    * **`S_audio`**: Audio is captured at 16kHz (or the device's native rate on iOS), focusing on prosody, not semantics.
    * **`S_motion`**: On mobile, IMU accelerometer and gyroscope data is captured at 60–100Hz. On desktop, mouse pointer dynamics substitute—path curvature, directional entropy, speed distribution, and micro-correction frequency capture habitual motor control patterns unique to each user.
    * **`S_touch`**: Touch and pointer events (coordinates, pressure, contact area) are captured from the digitizer.

#### **2.3. The Transformation Pipeline: From Raw Data to Hash**

The novelty of the TBH lies in this specific multi-stage pipeline, published as a defensive disclosure to establish prior art.

**Step 1: Feature Extraction (The "Distillation")**
The raw time-series data is distilled into a 134-dimensional feature vector (`V_features`) by applying specialized mathematical transformations across three parallel pipelines.

* **Speaker Features (`S_audio` → `V_audio`, 44 dimensions):**
    1.  **Fundamental Frequency and Perturbation:** F0 statistics and delta, jitter measures (local, RAP, PPQ5, DDP), shimmer measures (local, APQ3, APQ5, DDA), and harmonics-to-noise ratio (HNR). These capture the physiological characteristics of the vocal tract and laryngeal control. Each feature presents a distinct challenge to synthesis—F0 is trivial to match with TTS engines, but jitter and shimmer measure involuntary micro-perturbations that TTS produces with unnaturally low or uniform values. HNR catches synthetic audio because TTS produces unnaturally clean signals without the breath noise present in real speech.
    2.  **Formant Ratios and Spectral Shape:** Formant frequency ratios (F1/F2, F2/F3) via LPC analysis, and Long-Term Average Spectrum (LTAS) statistics (spectral centroid, rolloff, flatness, spread) capture vocal tract resonance geometry. These features are stable within a speaker but vary across individuals.
    3.  **Statistical Condensing:** Voicing ratio, amplitude statistics with entropy, and per-feature moments are computed over the capture period, producing a fixed-size vector `V_audio` representing the speaker's vocal signature.

* **Kinematic Features (`S_motion`, `S_touch` → `V_kinematic`, 54 dimensions):**
    1.  **Jerk and Jounce Analysis:** The third (jerk) and fourth (jounce) derivatives of the touch-coordinate data are computed. Involuntary human movements have a unique, high-frequency jerk signature that is difficult for algorithms to replicate.
    2.  **Path Dynamics:** Path curvature, directional entropy, speed and acceleration profiles, micro-correction frequency, pause ratios, path efficiency, segment lengths, speed jitter variance, normalized path length, and angle autocorrelation.
    3.  **Statistical Condensing:** Statistical moments of these kinematic features produce a fixed-size vector `V_kinematic`.

* **Touch Features (`S_touch` → `V_touch`, 36 dimensions):**
    1.  Touch coordinate velocity and acceleration, pressure statistics, contact area statistics, path jerk, and per-signal jitter variance. These capture fine motor control patterns unique to each user.

**Step 2: Feature Fusion and Hashing (The "Amalgamation")**
1.  **Normalization:** Each modality group is independently normalized to zero mean and unit variance (z-score normalization), ensuring equal contribution to SimHash regardless of raw magnitude differences. Non-finite values are sanitized to zero before normalization.
2.  **Concatenation:** The feature vectors `V_audio`, `V_kinematic`, and `V_touch` are concatenated into a single 134-dimensional vector, `V_fused`.
3.  **Perceptual Hashing (SimHash):** We use a locality-sensitive hashing (LSH) algorithm, specifically **SimHash**, which is designed so that similar inputs result in similar hashes. The `V_fused` vector is projected onto 256 deterministic random hyperplanes. The final hash, the **Temporal Fingerprint (`F_T`)**, is a 256-bit string where each bit represents which side of a hyperplane the vector fell. Two `F_T` values from the same user will have a small Hamming distance (typically 20–65 bits in our testing). Two values from different people will have a distance near 128 (random). A replayed fingerprint will have distance 0.

**Step 3: Cryptographic Commitment (The "Sealing")**
The Temporal Fingerprint (`F_T`) is private. To create a verifiable public commitment, we hash it.
1.  **Salt and Hash:** A cryptographically-secure random 248-bit salt is generated. The fingerprint's 256 bits are packed into two 128-bit BN254 field elements. The final **Temporal-Biometric Hash (`H_TBH`)** is computed as:
    `H_TBH = Poseidon(pack_lo(F_T), pack_hi(F_T), salt)`
    The **Poseidon hash function** is chosen for its efficiency in ZK-SNARK circuits, a critical requirement for the verification stage. The pair (`H_TBH`, `salt`) is the output, with `salt` and `F_T` remaining private to the user.

---

### **3. Pillar II: ZK Self-Proof—Verification without Disclosure**

#### **3.1. Objective**

To verify that a user's current Temporal Fingerprint is consistent with their previous one—without any party learning either value. The protocol must allow on-chain verification of this consistency claim using only the Poseidon commitments as public inputs.

#### **3.2. The Hamming Distance Circuit**

We implement this as a Groth16 circuit (BN254 curve, ~1,996 constraints) that proves three statements:

1. `Poseidon(pack(F_T_new), salt_new) == commitment_new`
2. `Poseidon(pack(F_T_prev), salt_prev) == commitment_prev`
3. `min_distance <= HammingDistance(F_T_new, F_T_prev) < threshold`

**Public inputs:** `commitment_new`, `commitment_prev`, `threshold`, `min_distance`
**Private witnesses:** `F_T_new[256]`, `F_T_prev[256]`, `salt_new`, `salt_prev`

The minimum distance constraint (`min_distance = 3`) prevents exact replay attacks—a replayed fingerprint produces distance 0. The threshold constraint (`threshold = 96`) rejects fingerprints from different people. The circuit computes Hamming distance via bitwise XOR and popcount, expressed as R1CS constraints.

#### **3.3. On-Chain Verification**

Proof generation runs client-side in the browser using snarkjs (WASM), taking under 1 second on modern hardware. The proof is serialized into 256 bytes with 4 public inputs (32 bytes each).

On-chain verification uses the `groth16-solana` crate, which implements the BN254 pairing check within Solana's compute budget (<200K compute units). The verification program:

1. Validates a challenge nonce (anti-replay, single-use, time-limited to 5 minutes)
2. Runs the Groth16 pairing check
3. If valid, creates a VerificationResult PDA as an audit trail
4. If invalid, reverts the entire transaction (challenge nonce preserved for retry)

#### **3.4. Trusted Setup**

The Groth16 circuit requires a structured reference string produced by a trusted setup ceremony. Phase 1 uses the Hermez community Powers of Tau ceremony—multi-contributor, production-grade, circuit-agnostic. Phase 2 currently has a single contributor with entropy from system randomness. A multi-party computation ceremony with 10+ independent contributors will precede mainnet deployment. The toxic waste is compromised only if all contributors collude.

#### **3.5. The Anonymity Ring**

The ZK self-proof model eliminates the need for validators to compute on biometric data. The Anonymity Ring's role is simplified to: (a) issuing challenge nonces via Switchboard VRF, (b) relaying verification attestations, and (c) attesting on-chain via aggregate signature. Ring members are selected by VRF output against a difficulty threshold, using staked IAM tokens as collateral.

---

### **4. Pillar III: Game Theory and Economic Incentivization**

#### **4.1. Objective**

To create a cryptoeconomic model that aligns the incentives of all participants with the long-term security of the protocol. The system must ensure that honest participation is profitable and that the cost of a successful attack is prohibitively high.

#### **4.2. The IAM Token**

The protocol's economic security is anchored by a native utility token, the **IAM token** (SPL Token-2022 with Confidential Balances extension), used for:
1.  **Staking for Eligibility:** Validators must stake a minimum amount of IAM to participate in the Anonymity Ring.
2.  **Verification Capacity:** Integrators stake IAM for discounted or unlimited verifications, replacing per-verification fees with a capacity tier model.
3.  **Governance:** IAM holders vote on protocol parameter changes (minimum stake thresholds, trust score weights, fee structure).

#### **4.3. Incentive Design: The Validation Cycle**

The economic cycle is designed as a closed loop. Users never pay—the integrating application (dApp, website, protocol) funds verifications.

1.  **Integrator Deposit:** An integrating application deposits SOL, USDC, or staked IAM tokens into a protocol escrow to purchase verification capacity at approximately $0.01 per verification.
2.  **Relayer Submission:** When a user completes a verification, the IAM relayer submits the on-chain transaction using funds from the integrator's escrow. The user requires no wallet and pays no fees.
3.  **The Fee Pool:** A margin on each verification (~$0.007 on a ~$0.01 fee) is collected into the protocol treasury.
4.  **Reward Distribution:** The treasury uses the fees to buy IAM from the open market, which is then distributed as rewards to honest validators. This creates buy pressure proportional to real verification volume.

#### **4.4. Punishment Design: Slashing and Ejection**

The validator stake is the core of the punishment mechanism. Malicious behavior is detected via a probabilistic **"Audit Ring"** mechanism.

1.  **Probabilistic Audits:** A small, random fraction (0.5%) of all successful validations automatically triggers a secondary audit by a new, independent Anonymity Ring.
2.  **Slashing Conditions:**
    * **Disagreement (False Positive):** If the primary Ring approved a validation but the Audit Ring rejects it, all members of the primary Ring have their stake slashed. A portion of the slashed IAM is awarded to the Audit Ring members.
    * **Non-Participation:** A validator who fails to participate within the time limit incurs progressive micro-slashing, with repeated failures leading to full ejection.
3.  **Unstaking:** Validators can unstake and recover their full stake when not under investigation.

---

### **5. Pillar IV: The IAM Anchor—DID Architecture and Application Layer**

#### **5.1. The IAM Anchor: An Evolving DID**

The Anchor is implemented as a non-transferable identity token using SPL Token-2022 with the NonTransferable mint extension. It is not a static certificate but a living record of an individual's proven temporal consistency.

**On-Chain Data Structure (IdentityState PDA):**

| Field | Type | Purpose |
|-------|------|---------|
| `owner` | Pubkey | Wallet that controls this identity |
| `creation_timestamp` | i64 | When the identity was first minted |
| `last_verification_timestamp` | i64 | Most recent successful verification |
| `verification_count` | u32 | Total successful verifications |
| `trust_score` | u16 | Progressive reputation metric |
| `current_commitment` | [u8; 32] | Latest Poseidon commitment |
| `recent_timestamps` | [i64; 10] | Rolling window for Trust Score computation |

The PDA is derived from the owner's wallet public key, ensuring a one-to-one mapping between wallets and identities.

#### **5.2. Progressive Trust Score**

The Trust Score is a numerical representation of the identity's reliability. It rewards consistency over time, not rapid repetition—a bot verifying 100 times in one day scores lower than a human verifying weekly for months.

The formula combines three components:

1.  **Recency-weighted verification count.** Each of the last 10 verification timestamps contributes `3000 / (30 + days_since)` to a recency score with a 30-day half-life, multiplied by a base increment from the protocol config.
2.  **Regularity bonus.** The standard deviation of gaps between consecutive verifications is computed. Lower variance (more regular spacing) yields a higher bonus, up to 20 points.
3.  **Age bonus.** `isqrt(min(age_days, 365)) * 2`, where `isqrt` is deterministic integer square root via Newton's method. Diminishing returns prevent gaming via old unused accounts.

The score is capped at a protocol-configurable maximum (currently 10,000) and computed on-chain inside the `update_anchor` instruction, reading parameters from a cross-program PDA. The caller cannot set an arbitrary score.

#### **5.3. Walletless Mode**

The default verification flow requires no wallet. The user visits a website that embeds the Pulse SDK, completes a 12-second behavioral challenge, and receives a verification result. The ZK proof is submitted to a relayer service funded by the integrating application's escrow deposit. The user's biometric fingerprint is stored locally (encrypted with AES-256-GCM, key in IndexedDB) for future re-verification.

Wallet-connected mode exists for DeFi and DAO users who want self-custody. The user signs the verification transaction directly, mints their IAM Anchor, and builds an on-chain Trust Score.

#### **5.4. Application Layer**

The utility of the Anchor is unlocked when dApps query it via on-chain reads or ZK proofs:

* **Proof of Uniqueness:** The user has a valid IAM Anchor with a recent verification.
* **Proof of Maturity:** The Anchor's `creation_timestamp` predates a cutoff.
* **Proof of Trust:** The Anchor's `trust_score` exceeds a threshold.

---

### **6. Security Analysis**

#### **6.1. Replay Attacks**

The ZK circuit enforces `min_distance >= 3`. An exact replay (distance 0) or near-replay (distance 1–2) is rejected at the proof level. Challenge nonces are single-use and time-limited. A replayed proof with a consumed nonce fails before reaching the verifier.

#### **6.2. Synthetic Data**

A bot must simultaneously fake voice prosody, motion dynamics, and touch pressure across 12 seconds of parallel capture. Spoofing one modality is feasible. Spoofing all three—with consistent behavioral entropy—is not. The 134-dimensional feature vector projects through SimHash into a 256-bit fingerprint where each bit depends on all modalities combined.

#### **6.3. Sybil Attacks**

Each wallet maps to exactly one IAM Anchor. Creating multiple identities requires multiple wallets with independent behavioral profiles sustained across re-verifications. The Trust Score penalizes new accounts and irregular patterns. The economic cost of maintaining many fake identities with consistent behavioral drift exceeds the value extractable from most Sybil attacks.

#### **6.4. Privacy**

Raw biometric data never leaves the user's device. The ZK proof is the only output transmitted. The biometric fingerprint stored locally for re-verification is encrypted with AES-256-GCM using a non-extractable CryptoKey in IndexedDB. On-chain, only the Poseidon commitment is stored—a one-way hash that cannot be reversed to recover the fingerprint.

---

### **7. Related Work**

**Worldcoin** uses iris scanning to create a unique biometric identifier per person. The approach requires custom hardware (the Orb), stores a permanent biometric template, and has been banned or restricted in 12+ jurisdictions—a consequence of collecting anatomical data that cannot be revoked.

**BrightID** verifies uniqueness through social graph analysis. Users vouch for each other in verification parties. The system is vulnerable to coordinated collusion and requires social coordination that limits adoption.

**Reclaim Protocol** proves ownership of existing web2 accounts via TLS session proofs. It answers "do you control this account?"—not "are you human?" IAM and Reclaim are complementary.

---

### **8. Implementation Status**

The protocol is deployed on Solana devnet with end-to-end verification working in the browser on desktop and mobile.

| Component | Status |
|-----------|--------|
| On-chain programs (Anchor/Rust) | 3 programs deployed on devnet. Access control, on-chain Trust Score, proof revert on failure. |
| ZK circuit (Groth16/Circom) | Hamming distance circuit with min_distance. Trusted setup complete (single contributor, ceremony before mainnet). |
| Pulse SDK (TypeScript) | Published on npm. 52 tests. Speaker features, kinematic extraction, SimHash, Poseidon, Groth16 proving, encrypted localStorage. |
| Executor node (Rust) | Live on Railway. Relayer API, rate limiting, quota tracking, commitment registry. |
| Demo application (Next.js) | Live on Vercel. Walletless and wallet-connected verification flows. |

---

### **9. Conclusion and Future Work**

The IAM Protocol presents a framework for a new generation of Proof-of-Humanity and Decentralized Identity. By shifting the paradigm from static secrets to dynamic, temporal consistency, it offers a path to resolving the fundamental tension between security, privacy, and accessibility in digital identity.

Instead of asking, *"What is your secret?"*, it asks, *"Are you still you?"*

**Future work:**
* **Multi-contributor trusted setup ceremony** for Groth16 Phase 2 before mainnet.
* **External security audit** of all on-chain programs, the ZK circuit, and the executor node.
* **Integrator onboarding:** integration SDK, developer documentation, and escrow deposit flow.
* **IAM utility token:** SPL Token-2022 with Confidential Balances. Validator staking, capacity tiers, and governance.
* **Cross-chain deployment:** Port the verification flow to Ethereum L2s after Solana mainnet stabilizes.

The protocol is open source and published as a defensive disclosure to establish prior art. The source code, circuit definitions, and SDK are available at `github.com/iam-protocol`.

---

### **References**

[1] Douceur, J. R. "The Sybil Attack." IPTPS, 2002.
[2] Charikar, M. S. "Similarity estimation techniques from rounding algorithms." STOC, 2002.
[3] Grassi, L., et al. "Poseidon: A New Hash Function for Zero-Knowledge Proof Systems." USENIX Security, 2021.
[4] Groth, J. "On the Size of Pairing-Based Non-interactive Arguments." EUROCRYPT, 2016.
[5] Boneh, D., et al. "Verifiable Random Functions." FOCS, 1999.
