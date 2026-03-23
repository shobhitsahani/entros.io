# IAM Protocol: A Framework for Temporally-Consistent, Decentralized Proof-of-Humanity

**Document Version:** 2.0 (Updated for Solana / ZK Self-Proof Architecture)
**Original Date:** June 27, 2025
**Updated:** March 19, 2026
**Word Count:** Approx. 5000

---

#### **Abstract**

The proliferation of sophisticated AI and bot networks necessitates a robust method for verifying human uniqueness and liveness in digital ecosystems—a concept known as Proof-of-Humanity (PoH). Existing solutions often rely on centralized authorities, invasive static biometrics (e.g., iris scans), or socially-correlatable data, creating significant vulnerabilities in privacy, security, and accessibility. This paper introduces the IAM Protocol, a novel, decentralized framework for PoH and Self-Sovereign Identity (SSI). Its core innovation is the concept of **temporal consistency**, asserting that a human's identity is best proven not by a single secret, but by the dynamic, chaotic, and continuous signature of their biological and behavioral patterns over time. The framework leverages a multi-modal "Liveness Interlock" to generate a **Temporal-Biometric Hash (TBH)**, which is then validated by a decentralized "Anonymity Ring" of peers using Multi-Party Computation (MPC). The resulting attestations are anchored to an evolving, non-transferable token (NTT), forming a private and secure Decentralized Identity (DID). This paper details the mathematical foundations of the TBH, the cryptographic architecture of the validation mechanism, the game-theoretic incentives underpinning the system's security, and the application layer that brings its utility to the digital world.

**Keywords:** *Proof-of-Humanity (PoH), Decentralized Identity (DID), Behavioral Biometrics, Multi-Party Computation (MPC), Zero-Knowledge Proofs (ZKP), Liveness Detection, Temporal Consistency, Non-Transferable Tokens (NTT).*

---

### **1. Introduction: The Core Philosophy of the IAM Protocol**

The digital landscape is at an inflection point. The distinction between human and artificial actors is increasingly blurred, posing an existential threat to the integrity of online economies, governance models, and social platforms. Sybil attacks, where a single adversary creates numerous fake identities, can undermine everything from fair token distribution (airdrops) and democratic voting in DAOs to the spread of disinformation.

The fundamental flaw in most current PoH systems is their reliance on a single, static biometric "secret" (an iris scan, a palm print). This is analogous to using the same password everywhere. If it's compromised once, it's compromised forever. The IAM Protocol operates on a different principle: **Proof-of-Humanity through Temporal Consistency and Multi-Modal Biometric Hashing.** A human is not a static data point; they are a continuous, dynamic process. The "liveness" of a human has a unique, chaotic, and high-entropy signature over time. AI can mimic a snapshot, but mimicking this temporal signature perfectly is computationally prohibitive.

Instead of asking, *"What is your secret?"*, we ask, *"Are you still you?"*. By focusing on the unique, difficult-to-replicate *dynamics* of human liveness over time, we create a more resilient, private, and equitable foundation for digital identity.

The framework is built on three pillars, which this paper will detail in subsequent sections:

1.  **The Liveness Interlock (The "Pulse"):** A multi-modal, time-series liveness check that generates a temporary, high-entropy "Temporal-Biometric Hash," detailed in Section 2.
2.  **The Anonymity Ring (The "Chorus"):** A decentralized validation process using Multi-Party Computation (MPC) and Ring Signatures, where a small, random group of peers validates a user's Pulse without ever seeing their data, detailed in Section 3.
3.  **The IAM Anchor (The "Anchor"):** An evolving, non-transferable token that acts as the user's DID, storing cryptographic attestations of their temporal consistency, not their raw data. This is supported by a robust economic model (Section 4) and provides a flexible application layer (Section 5).

---

### **2. Pillar I: Mathematical Modeling of the Temporal-Biometric Hash (TBH)**

#### **2.1. Objective**

To define a deterministic, yet unpredictable, process for converting raw, multi-modal sensor data into a compact, secure, and privacy-preserving cryptographic hash. This process must satisfy the following criteria: High Uniqueness, High Spoof-Resistance, Temporal Consistency, Privacy Preservation, and Computational Efficiency on standard consumer hardware.

#### **2.2. The Liveness Interlock: Data Acquisition Protocol**

The TBH is generated from data captured during the "Liveness Interlock," a user-facing challenge designed to elicit unique behavioral and biological responses.

* **Challenge Generation:** The protocol issues a nonce-seeded challenge consisting of two parts: a phonetically-balanced, non-sensical phrase to be spoken aloud (e.g., *"Oro rura lamo ree see"*) to prevent dictionary-based audio deepfake attacks, and a simple, continuous 2D gesture to be traced on the screen (e.g., a Lissajous curve).
* **Synchronous Data Streams (`S`):**
    * **`S_audio`**: Audio is captured at 16kHz, focusing on prosody, not semantics.
    * **`S_motion`**: Motion is captured from the IMU (accelerometer + gyroscope) at 100Hz, capturing hand tremor and unique motor control dynamics.
    * **`S_touch`**: Touch events (coordinates, pressure, area) are captured from the digitizer at 120Hz.

#### **2.3. The Transformation Pipeline: From Raw Data to Hash**

The novelty and patentability of the TBH lie in this specific multi-stage pipeline.

**Step 1: Feature Extraction (The "Distillation")**
The raw time-series data is distilled into a concise feature vector (`V_features`) by applying specialized mathematical transformations.

* **Audio Processing (`S_audio` -> `V_audio`):**
    1.  **Speaker Feature Extraction:** The audio signal is analyzed for fundamental frequency (F0), jitter (pitch perturbation), shimmer (amplitude perturbation), and harmonics-to-noise ratio (HNR). These capture the physiological characteristics of the vocal tract and laryngeal control.
    2.  **Formant Ratios and Spectral Shape:** Formant frequency ratios (F1/F2, F2/F3) and Long-Term Average Spectrum (LTAS) statistics capture vocal tract resonance geometry. These features are stable within a speaker but vary across individuals.
    3.  **Statistical Condensing:** F0 contour statistics, jitter and shimmer measures, and per-feature entropy are computed over the capture period. This condenses the temporal data into a fixed-size vector `V_audio` representing the speaker's vocal signature.

* **Motion & Touch Processing (`S_motion`, `S_touch` -> `V_kinematic`):**
    1.  **Jerk and Jounce Analysis:** We compute the third (jerk) and fourth (jounce) derivatives of the motion and touch-coordinate data. Involuntary human movements have a unique, high-frequency jerk signature that is difficult for algorithms to replicate.
    2.  **Mouse Dynamics (Desktop):** On devices without motion sensors, mouse movement patterns replace IMU data. Path curvature, directional entropy, speed distribution, and micro-correction frequency capture habitual motor control patterns unique to each user.
    3.  **Statistical Condensing:** Similar to audio, we compute statistical moments of these kinematic features to produce a fixed-size vector `V_kinematic`.

**Step 2: Feature Fusion and Hashing (The "Amalgamation")**
1.  **Concatenation:** The feature vectors `V_audio` and `V_kinematic` are concatenated into a single feature vector, `V_fused`.
2.  **Perceptual Hashing (SimHash):** We use a locality-sensitive hashing (LSH) algorithm, specifically **SimHash**, which is designed so that similar inputs result in similar hashes. The `V_fused` vector is projected onto a set of random hyperplanes. The final hash, the **Temporal Fingerprint (`F_T`)**, is a bitstring where each bit represents which side of a hyperplane the vector fell. Two `F_T` values from the same user will have a small Hamming distance.

**Step 3: Cryptographic Commitment (The "Sealing")**
The Temporal Fingerprint (`F_T`) is private. To create a verifiable public commitment, we hash it.
1.  **Salt and Hash:** A large, cryptographically-secure random number (the `salt`) is generated. The final **Temporal-Biometric Hash (`H_TBH`)** is computed as:
    `H_TBH = Poseidon(F_T || salt)`
    The **Poseidon hash function** is chosen for its efficiency in ZK-SNARK circuits, a critical requirement for later stages. The pair (`H_TBH`, `salt`) is the output, with `salt` and `F_T` remaining private to the user.

---

### **3. Pillar II: The Anonymity Ring - Cryptographic Architecture**

#### **3.1. Objective**

To design a decentralized, trustless, and anonymous protocol for validating a user's Temporal Fingerprint (`F_T`). The protocol must allow a group of existing members to verify the consistency of a new `F_T` from a user against their historical record, without any party learning anything about the user's actual biometric data.

#### **3.2. Ring Formation and Collusion Resistance**

We use Verifiable Random Functions (VRFs) and staking to ensure fair and unpredictable validator selection.
1.  **Eligibility:** A user must have a mature IAM Anchor and stake a minimum amount of the native token to be eligible.
2.  **Selection Process:** When a user (Prover) initiates a validation, all eligible validators locally compute a VRF output using a recent block hash. Those whose output falls below a difficulty threshold submit their proof. The Prover's client selects the first `n` valid proofs it sees to form the Anonymity Ring (`R`). This process is decentralized and resistant to manipulation.

#### **3.3. The Core Validation Protocol: MPC with Homomorphic Encryption**

The goal is for the Ring to confirm that the Hamming distance between the user's `F_T_new` and their historical model (represented by `F_T_previous`) is below a threshold `t`, without seeing either value.

**Pre-computation:** The user's `F_T_previous` is stored in their private vault, encrypted under a Paillier homomorphic encryption scheme: `Enc(F_T_previous)`.

**The Protocol:**
1.  **User's Preparation:** The user computes the bitwise XOR between new and previous fingerprints: `X = F_T_new ⊕ F_T_previous`. They encrypt each bit of `X` individually with the Paillier public key and distribute these encrypted bits among the Ring members using a secret sharing scheme.
2.  **MPC-based Summation:** The Ring members engage in an MPC protocol. Leveraging the additive property of Paillier (`Enc(a) * Enc(b) = Enc(a+b)`), they collectively multiply the encrypted bits they hold to compute the encrypted sum of the bits, which is the encrypted Hamming distance: `Enc(HammingDistance)`.
3.  **Threshold Check:** The members engage in a second MPC protocol (e.g., using Yao's Garbled Circuits) to perform a private comparison. The protocol takes `Enc(HammingDistance)` and a public `Enc(t)` as input and outputs a single shared bit, `b_result`, indicating if the distance is less than the threshold, without revealing the actual distance.

#### **3.4. Validator Attestation: Anonymous Approval via Ring Signatures**

If `b_result` is `1`, the Ring must attest to this on-chain.
1.  **Message Creation:** The members agree on a standard validation message `M`, such as `M = "Validation(H_TBH_new, timestamp)"`.
2.  **Ring Signature Generation:** The members of Ring `R` form a public key group. One member generates a **Ring Signature** `σ` for the message `M`.
3.  **Transaction Broadcast:** The signature is broadcast to the blockchain. The smart contract can verify that `σ` is a valid signature from *some member* of the public key group `R`, but cannot determine which one, thus protecting the validators.

---

### **4. Pillar III: Game Theory and Economic Incentivization**

#### **4.1. Objective**

To create a cryptoeconomic model that aligns the incentives of all participants with the long-term security of the protocol. The system must ensure that honest participation is profitable and that the cost of a successful attack is prohibitively high.

#### **4.2. The IAM (IAM) Token**

The protocol's economic security is anchored by a native utility token, the **IAM (IAM) token**, used for:
1.  **Staking for Eligibility:** Users must stake a minimum amount of IAM (`S_min`) to become validators, acting as collateral.
2.  **Rewarding Honest Validation:** Validators receive rewards in IAM.
3.  **Governance:** IAM holders vote on protocol parameter changes.

#### **4.3. Incentive Design: The Validation Cycle**

The economic cycle is designed as a closed loop. Users never pay — the integrating application (dApp, website, protocol) funds verifications.

1.  **Integrator Deposit:** An integrating application deposits SOL, USDC, or staked IAM tokens into a protocol escrow to purchase verification capacity. This is analogous to how hCaptcha charges websites per verification, not end users.
2.  **Relayer Submission:** When a user completes a verification, the IAM relayer submits the on-chain transaction using funds from the integrator's escrow. The user requires no wallet and pays no fees.
3.  **The Fee Pool:** A margin on each verification (~$0.007 on a ~$0.01 fee) is collected into the protocol treasury.
4.  **Reward Distribution:** The treasury periodically uses the fees to buy IAM from the open market, which is then distributed as rewards to honest validators. This creates constant buy pressure for IAM based on real-world utility.

#### **4.4. Punishment Design: Slashing and Ejection**

The stake `S_min` is the core of the punishment mechanism. Malicious behavior is detected via a probabilistic **"Audit Ring"** mechanism.

1.  **Probabilistic Audits:** A small, random fraction (e.g., 0.5%) of all successful validations automatically triggers a secondary audit by a new, larger Anonymity Ring.
2.  **Slashing Conditions:**
    * **Disagreement (False Positive):** If the primary Ring approved a validation but the Audit Ring rejects it, all `n` members of the primary Ring have their `S_min` stake slashed. A portion of the slashed IAM is awarded to the Audit Ring members, incentivizing this "policing" work.
    * **Non-Participation (Censorship):** A validator who fails to participate in a protocol within the time limit incurs a micro-slash, with repeated failures leading to full ejection.

---

### **5. Pillar IV: The IAM Anchor - DID Architecture and Application Layer**

#### **5.1. Objective**

To define the architecture of the IAM Protocol's Decentralized Identity (DID) component, the "IAM Anchor." This architecture must serve as a secure, private, and persistent root of trust for an individual's digital life. It needs to be an evolving entity that grows in trustworthiness over time, while providing a flexible interface for third-party applications (dApps) to verify claims without compromising user privacy.

#### **5.2. The IAM Anchor: An Evolving DID**

The Anchor is implemented as a non-transferable token, adhering to modern standards for such assets. It is not a static certificate but a living record of an individual's proven temporal consistency. Its structure is a hybrid of on-chain and off-chain data.

**5.2.1. On-Chain Data Structure**
The on-chain program for the Anchor stores only public, non-sensitive metadata. The implementation targets Solana (via the Anchor framework) using Program Derived Addresses (PDAs) for each identity, but the data model is chain-agnostic:

**Anchor Data Fields:**
- `creation_timestamp` (u64): When the identity was first minted
- `last_verification_timestamp` (u64): Most recent successful verification
- `verification_count` (u32): Total successful verifications
- `trust_score` (u16): Computed reputation metric
- `current_commitment` (bytes32): Latest Poseidon commitment H_TBH
- `owner` (public key): The wallet that controls this identity

The Anchor is implemented as a non-transferable token using SPL Token-2022 with a transfer hook that rejects all transfers. The PDA is derived from the owner's wallet public key, ensuring a one-to-one mapping between wallets and identities.

* **Trust Score (`trust_score`):** This key innovation is a numerical representation of the identity's reliability, calculated from its age, verification count, and the regularity of re-verifications. It incentivizes users to maintain their identity's "liveness."

#### **5.2.2. Off-Chain Data (User's Private Data Vault)**
The user's private data vault holds the sensitive information: the encrypted **Historical Consistency Model (`M_H`)**, past (`F_T`, `salt`) pairs, and any W3C-compliant Verifiable Credentials (VCs).

### **5.3. ZKP-Powered Application Layer**
The utility of the Anchor is unlocked when dApps interact with it via Zero-Knowledge Proofs.

**The Interaction Flow:**
1.  **dApp Request:** A dApp requests proof of a claim (e.g., "Prove you are a unique human over 18").
2.  **User's Wallet Generates Proof:** The user's wallet acts as the Prover, using on-chain and off-chain data to generate a ZK-SNARK.
3.  **dApp Verifies Proof:** The dApp acts as the Verifier, confirming the proof's validity without learning any underlying private data.

**Example ZKP Circuits (Proof Schemas):**
* **Proof of Uniqueness:** Proves the user has a recent, valid Ring Signature attestation.
* **Proof of Maturity:** Proves the Anchor's `creationTimestamp` is before a certain date.
* **Proof of Trust:** Proves the Anchor's `trustScore` is above a certain threshold.

### **5.4. Integrating with Verifiable Credentials (VCs)**
The system is designed for seamless integration with third-party credentials.

1.  **Issuance:** A trusted issuer (e.g., a government) issues a VC where the `credentialSubject` is the user's IAM Protocol DID.
2.  **Storage:** The user stores this VC in their private vault.
3.  **ZKP Generation about VCs:** The user can generate a single ZKP for a compound statement, such as `ZK.prove(user.is_unique() AND user.is_over_18())`. The dApp learns only that the user is compliant, not their specific identity or age.

---

### **6. Conclusion and Future Work**
The IAM Protocol presents a comprehensive, multi-layered framework for a new generation of Proof-of-Humanity and Decentralized Identity. By shifting the paradigm from static secrets to dynamic, temporal consistency, it offers a path to resolving the fundamental trilemma of security, privacy, and accessibility in digital identity. The synthesis of behavioral biometrics, advanced cryptography (MPC, ZKPs, Ring Signatures), and robust cryptoeconomic incentives creates a resilient ecosystem where trust is not merely asserted but continuously earned and proven.

The novelty of the framework is found in the specific, interlocking architecture of its pillars: the multi-modal hashing pipeline of the TBH, the privacy-preserving validation protocol of the Anonymity Ring, the probabilistic audit mechanism of the economic model, and the dynamic, evolving nature of the IAM Anchor.

**Future work will proceed along the following tracks:**
* **Prototype Development:** Building a proof-of-concept implementation of the Liveness Interlock on mobile devices and smart contract deployment on a testnet.
* **Performance Analysis:** Benchmarking the computational overhead of the MPC and ZKP circuits to ensure a smooth user experience.
* **Security Audits:** Rigorous third-party audits of the cryptographic protocols and smart contracts to identify and mitigate potential vulnerabilities.
* **Pilot Programs:** Partnering with DAOs, DeFi protocols, and Web3 social platforms to test the framework in real-world scenarios and gather feedback for further refinement.

By building the IAM Protocol, we aim to provide a foundational public good for the next generation of the internet—an internet where digital identity is secure, self-sovereign, and fundamentally human.

---

### **Addendum: v2 Implementation Architecture (March 2026)**

The v2 implementation introduces two significant architectural changes from the original framework described above, while preserving all mathematical foundations:

**1. Target Chain: Solana**
The protocol targets Solana as its primary deployment chain. Solana offers 100-1000x lower costs for identity operations ($0.001 for ZK verification vs $2-20 on Ethereum), sub-second finality, native Poseidon hashing support (`solana-poseidon`, `light-poseidon`), production-ready Groth16 verification (<200K compute units via `groth16-solana`), and a Rust-native development environment that unifies on-chain programs with the off-chain executor. The acute Sybil problem on Solana (98M monthly users, $370-500M extracted by MEV bots) provides immediate market demand.

**2. ZK Self-Proof Replacing MPC**
The original Anonymity Ring MPC protocol (Section 3.3) — while theoretically sound — presents significant deployment challenges at consumer scale (latency, coordination, complexity). The v2 architecture replaces the MPC-based validation with a **ZK self-proof model**: the user's device generates a Groth16 zero-knowledge proof that their new TBH is within Hamming distance `t` of their previous TBH, without revealing either value. The on-chain verifier program checks only the proof — it never sees the TBH or any biometric data.

This eliminates: the MPC coordination problem, peer-to-peer latency, Paillier encryption overhead, and Garbled Circuit complexity. The Anonymity Ring is preserved but its role is simplified to: (a) issuing challenge nonces (preventing replay), (b) vouching for verification witnesses, and (c) attesting on-chain via aggregate signature. Ring members no longer compute on biometric data.

The mathematical framework for the TBH (Section 2), the game-theoretic incentive model (Section 4), and the IAM Anchor DID architecture (Section 5) remain unchanged. See `IAM_V2_RESEARCH_AND_ANALYSIS.md` for the full strategic and technical rationale.

**3. Security Hardening (v2.1)**
The v2.1 update adds four layers of bot resistance:

- **Minimum Hamming distance constraint**: The ZK circuit now enforces `min_distance <= HammingDistance(F_T_new, F_T_prev) < threshold`. Perfect replay (distance 0) and near-replay (distance 1-2) are rejected at the proof level. Real human behavioral drift produces 5-20 bits of natural variation between sessions.

- **Behavioral entropy scoring**: The feature extraction pipeline computes Shannon entropy per speaker feature (F0, HNR, amplitude) and jitter variance (variance of windowed jerk variance) for motion and touch axes. Real human data has moderate, fluctuating entropy. Synthetic data from TTS engines or scripted inputs produces suspiciously uniform distributions that shift the SimHash fingerprint away from the baseline.

- **Progressive Trust Score**: The Trust Score formula uses recency-weighted verification count (30-day decay half-life), regularity bonuses (consistent weekly verification scores higher than 100 verifications in one day), and diminishing-returns age bonus (sqrt scaling). The Anchor stores the last 10 verification timestamps for rolling computation.

- **Per-session randomness**: Each verification generates a unique random phrase and Lissajous curve. No two sessions share the same challenge. The challenge elicits involuntary behavioral signatures (voice prosody, hand tremor, touch dynamics) rather than testing cognitive ability. A bot cannot precompute responses for an unknown prompt, and the behavioral entropy layers detect synthetic data regardless of challenge content.

- **Speaker feature resistance to synthesis**: Each audio feature presents a distinct challenge to synthetic replication. F0 (fundamental frequency) is trivial to match with text-to-speech engines. Formant ratios are harder because they encode vocal tract geometry specific to each individual. Jitter and shimmer are the strongest defenses: they measure involuntary micro-perturbations in pitch period and amplitude that TTS engines produce with unnaturally low or uniform values. HNR (harmonics-to-noise ratio) catches synthetic audio because TTS produces unnaturally clean signals without the breath noise present in real human speech. A generic bot fails on jitter, shimmer, and HNR. A sophisticated bot that models a specific person's vocal characteristics needs the target's F0, formant geometry, and realistic perturbation patterns simultaneously.

- **Multi-modal fusion**: A bot must fake voice, motion (or mouse dynamics), and touch pressure in parallel. Spoofing one modality is feasible. Spoofing all three with consistent behavioral entropy across 12 seconds of simultaneous capture is not. The 134-dimensional feature vector (44 speaker + 54 motion/mouse + 36 touch) projects through SimHash into a 256-bit fingerprint where each bit depends on all modalities combined.

These defenses do not claim cryptographic proof of humanness. They make Sybil attacks economically irrational by increasing the cost and time required to build and maintain fake identities at scale.
