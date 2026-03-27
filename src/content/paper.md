# IAM Protocol: A Framework for Temporally-Consistent, Decentralized Proof-of-Humanity

**Document Version:** 3.0 (Updated for Solana / ZK Self-Proof Architecture)
**Original Date:** June 27, 2025
**Updated:** March 27, 2026
**Word Count:** Approx. 5000

---

## Abstract

The proliferation of sophisticated AI and bot networks necessitates robust methods for verifying human uniqueness and liveness in digital ecosystems. Existing Proof-of-Humanity (PoH) solutions rely on centralized authorities, invasive static biometrics, or socially-correlatable data, creating vulnerabilities in privacy, security, and accessibility. We introduce the IAM Protocol, a decentralized framework for PoH and Self-Sovereign Identity built on Solana. The core innovation is *temporal consistency*: the assertion that human identity is best proven not by a static secret, but by the bounded, chaotic drift of biological and behavioral patterns over time. The framework captures multi-modal behavioral data (voice prosody, hand tremor, touch dynamics) during a configurable behavioral challenge, extracts a 134-dimensional feature vector, and produces a 256-bit locality-sensitive hash via SimHash. A Groth16 zero-knowledge proof verifies that consecutive fingerprints fall within a bounded Hamming distance without revealing either value. Attestations are anchored to non-transferable identity tokens (SPL Token-2022) with progressive Trust Scores. We provide formal security definitions, analyze the protocol against replay, synthesis, and Sybil attacks, introduce a graduated trust model distinguishing first-time liveness checks from sustained temporal consistency, and present benchmarks from a working implementation deployed on Solana devnet.

**Keywords:** *Proof-of-Humanity (PoH), Decentralized Identity (DID), Behavioral Biometrics, Zero-Knowledge Proofs, Groth16, SimHash, Liveness Detection, Temporal Consistency, Solana.*

---

### **1. Introduction**

The distinction between human and artificial actors in digital systems is increasingly blurred. Sybil attacks [1], where a single adversary creates numerous fake identities, undermine fair token distribution, democratic governance in DAOs, and the integrity of social platforms. The problem intensifies as generative AI produces increasingly realistic synthetic media.

The fundamental flaw in most current PoH systems is their reliance on a single, static biometric secret. Worldcoin [5] uses iris scanning—a permanent anatomical identifier that, once compromised, cannot be revoked. VeryAI uses palm prints with similar permanence constraints. BrightID [6] verifies uniqueness through social graph analysis, requiring coordinated verification parties vulnerable to collusion.

The IAM Protocol operates on a different principle. A human is not a static data point; they are a continuous, dynamic process. The behavioral signature of a living human—the micro-perturbations in voice, the involuntary tremor in hand movement, the idiosyncratic pressure patterns of touch—drifts over time in a bounded, chaotic pattern that is unique to each individual. AI can mimic a snapshot of this signature. Sustaining a temporally-consistent imitation across weeks and months is computationally prohibitive relative to the value extractable from most Sybil attacks.

Instead of asking *"What is your secret?"*, the protocol asks *"Are you still you?"*.

#### **1.1. Contributions**

1. A multi-modal behavioral capture protocol (the *Liveness Interlock*) that extracts a 134-dimensional feature vector from voice, motion, and touch data captured simultaneously over a configurable window.
2. A locality-sensitive hashing pipeline (*SimHash*) that produces a 256-bit *Temporal Fingerprint* where intra-person Hamming distance is bounded (~20–65 bits) while inter-person distance approaches random (~128 bits).
3. A Groth16 zero-knowledge circuit that proves two Poseidon-committed fingerprints fall within a bounded Hamming distance, without revealing either fingerprint.
4. A non-transferable on-chain identity token (the *IAM Anchor*) with a progressive Trust Score that rewards sustained temporal consistency over time.
5. A graduated trust model that honestly distinguishes first-time liveness checks from sustained behavioral consistency, with integrator-controlled trust thresholds.
6. A working implementation deployed on Solana devnet with end-to-end browser-based verification.

#### **1.2. Paper Organization**

Section 2 defines the Temporal-Biometric Hash pipeline. Section 3 presents the ZK circuit and on-chain verification. Section 4 details the economic model. Section 5 describes the IAM Anchor and Trust Score. Section 6 provides formal security analysis including the graduated trust model. Section 7 surveys related work. Section 8 presents implementation status and benchmarks.

---

### **2. The Temporal-Biometric Hash**

#### **2.1. Design Objectives**

The Temporal-Biometric Hash (TBH) pipeline must satisfy five properties:

**Definition 1 (TBH Requirements).** *A TBH scheme is a tuple of algorithms (Challenge, Capture, Extract, Hash, Commit) satisfying:*

1. **Uniqueness.** *Fingerprints from distinct individuals have high expected Hamming distance:* `E[d_H(F_A, F_B)] ≈ n/2` *for n-bit fingerprints, A ≠ B.*
2. **Temporal Consistency.** *Fingerprints from the same individual across sessions have bounded distance:* `d_H(F_t, F_{t+Δ}) ∈ [δ_min, δ_max]` *with high probability.*
3. **Spoof Resistance.** *Generating a fingerprint F' such that* `d_H(F', F_target) < δ_max` *requires knowledge of the target's behavioral characteristics across multiple modalities.*
4. **Privacy.** *The fingerprint F_T is never transmitted. Only a Poseidon commitment* `H_TBH = Poseidon(F_T, s)` *is published.*
5. **Efficiency.** *All operations run on consumer hardware within a browser context in under 5 seconds.*

#### **2.2. Challenge Generation**

The protocol issues a nonce-seeded challenge consisting of two components:

**Phonetic phrase.** A randomly-generated, phonetically-balanced nonsense phrase (e.g., *"Oro rura lamo ree see"*). Non-semantic phrases prevent dictionary-based audio deepfake attacks and elicit prosodic variation unique to each speaker.

**Lissajous curve.** A parametric curve `γ(t) = (A sin(at + δ), B sin(bt))` with random parameters `a, b, δ`. The user traces this curve on-screen, producing kinematic data shaped by involuntary motor control patterns.

#### **2.3. Multi-Modal Data Acquisition**

Three sensor streams are captured simultaneously over a configurable window (default: 7 seconds, extended to 12 seconds in the reference web application):

* `S_audio`: Microphone input at 16 kHz (or device-native rate), capturing voice prosody.
* `S_motion`: IMU accelerometer/gyroscope at 60–100 Hz on mobile; mouse pointer dynamics on desktop.
* `S_touch`: Pointer/touch events including coordinates, pressure, and contact area from the digitizer.

#### **2.4. Feature Extraction**

Raw time-series data is distilled into a 134-dimensional feature vector `v ∈ ℝ^134` through three parallel pipelines.

**Speaker Features (`v_audio ∈ ℝ^44`)**

**Fundamental frequency and perturbation.** F0 statistics and delta, jitter measures (local, RAP, PPQ5, DDP), shimmer measures (local, APQ3, APQ5, DDA), and harmonics-to-noise ratio (HNR). These capture physiological characteristics of the vocal tract and laryngeal control. F0 is trivial for TTS engines to match, but jitter and shimmer measure involuntary micro-perturbations that synthetic speech produces with unnaturally low or uniform values. HNR detects synthetic audio because TTS engines produce unnaturally clean signals without the breath noise present in real speech.

**Formant ratios and spectral shape.** Formant frequency ratios (F1/F2, F2/F3) via linear predictive coding (LPC) analysis [9], and Long-Term Average Spectrum (LTAS) statistics (spectral centroid, rolloff, flatness, spread) capture vocal tract resonance geometry.

**Statistical condensing.** Voicing ratio, amplitude entropy, and per-feature moments (mean, variance, skewness, kurtosis) over the capture window produce the fixed-size vector `v_audio`.

**Kinematic Features (`v_kin ∈ ℝ^54`)**

**Jerk and jounce analysis.** The third (jerk) and fourth (jounce) time derivatives of pointer coordinates are computed. Involuntary human movements exhibit characteristic high-frequency jerk signatures that scripted movements lack.

**Path dynamics.** Path curvature, directional entropy, speed and acceleration profiles, micro-correction frequency, pause ratios, path efficiency, segment length distribution, speed jitter variance, normalized path length, and angle autocorrelation. These features capture habitual motor control patterns unique to each individual [10].

**Touch Features (`v_touch ∈ ℝ^36`)**

Touch coordinate velocity and acceleration, pressure statistics, contact area statistics, path jerk, and per-signal jitter variance. These features reflect fine motor control patterns of the fingertip or stylus.

#### **2.5. Feature Fusion and SimHash**

**Normalization.** Each modality group is independently z-score normalized (μ = 0, σ = 1) to ensure equal contribution regardless of raw magnitude. Non-finite values are sanitized to zero.

**Concatenation.** The three vectors are concatenated: `v_fused = [v_audio ‖ v_kin ‖ v_touch] ∈ ℝ^134`.

**SimHash [2].** The fused vector is projected onto 256 deterministic random hyperplanes `{h_1, …, h_256}`. The Temporal Fingerprint is:

```
F_T[i] = 1  if v_fused · h_i ≥ 0
F_T[i] = 0  otherwise
```

for `i ∈ {1, …, 256}`. By the properties of SimHash, `Pr[F_T^(A)[i] ≠ F_T^(B)[i]] = (1/π) arccos(v_A · v_B / (‖v_A‖ ‖v_B‖))`, so similar feature vectors produce fingerprints with small Hamming distance.

#### **2.6. Relationship to Cancelable Biometrics and Fuzzy Extractors**

The problem of protecting biometric templates while enabling matching has a substantial academic history. *Fuzzy extractors* [14] derive cryptographic keys from noisy biometric inputs by correcting errors within a tolerance threshold. *Cancelable biometrics* [15] apply non-invertible transforms to biometric templates so that a compromised template can be revoked and replaced. Both approaches assume the biometric signal is fundamentally static—the same fingerprint or iris captured repeatedly with sensor noise.

IAM's behavioral biometrics present a different challenge. The signal is inherently non-stationary: voice prosody shifts with health, touch dynamics change with device, kinematic patterns evolve with habit. The "errors" between sessions are not noise to be corrected but genuine temporal variation that carries identity information. Fuzzy extractors' error-correction model does not apply because the variation is structured, not random. Cancelable transforms do not apply because the template itself drifts by design.

IAM addresses this through a different construction: SimHash produces a locality-sensitive fingerprint where bounded drift maps to bounded Hamming distance, and a Groth16 circuit proves that this distance falls within the expected range. The Poseidon commitment provides the revocability property—a user can generate a new salt to produce a fresh commitment without changing their behavioral profile. Recent work on practical fuzzy extractors for iris biometrics [16] achieves 105 bits of entropy with 92% true accept rate, providing a useful benchmark: IAM's 256-bit SimHash must be evaluated not by bit-length but by effective entropy under adversarial feature distributions, a question we identify as future work.

#### **2.7. Poseidon Commitment**

The fingerprint `F_T` is private. A public commitment is computed as:

```
H_TBH = Poseidon(pack_lo(F_T), pack_hi(F_T), s)
```

where `s` is a 248-bit random salt, and `pack_lo/hi` pack the 256 bits into two BN254 field elements. The Poseidon hash [3] is chosen for ZK circuit efficiency (~300 R1CS constraints per hash vs. ~25,000 for SHA-256).

---

### **3. ZK Self-Proof: Verification without Disclosure**

#### **3.1. Circuit Definition**

The Hamming distance circuit is a Groth16 [4] arithmetic circuit over BN254 with ~1,996 R1CS constraints. It proves three statements simultaneously:

1. `Poseidon(pack(F_T_new), s_new) = c_new`
2. `Poseidon(pack(F_T_prev), s_prev) = c_prev`
3. `δ_min ≤ d_H(F_T_new, F_T_prev) < δ_max`

**Public inputs:** `c_new, c_prev, δ_max, δ_min`

**Private witnesses:** `F_T_new[256], F_T_prev[256], s_new, s_prev`

The Hamming distance is computed via bitwise XOR and popcount, expressed as R1CS constraints: for each bit position `i`, `d_i = F_T_new[i] + F_T_prev[i] - 2 · F_T_new[i] · F_T_prev[i]`, then `d_H = Σ d_i` for `i = 1…256`.

The minimum distance constraint (`δ_min = 3`) prevents exact replay attacks. The threshold (`δ_max = 96`) rejects fingerprints from different people.

**Soundness guarantees.** Groth16 provides computational knowledge soundness under the Generic Group Model and the q-Power Knowledge of Exponent assumption [4]. For IAM's circuit, this means no probabilistic polynomial-time adversary can produce a valid proof for a false statement—wrong Hamming distance or wrong Poseidon preimage—except with negligible probability. The structured reference string introduces a trust assumption: an adversary who knows the toxic waste from *all* Phase 2 ceremony contributors can forge proofs. The multi-party ceremony ensures this requires universal collusion among independent participants.

#### **3.2. On-Chain Verification**

Proof generation runs client-side using snarkjs (WASM). The proof is serialized into 256 bytes with 4 public inputs (32 bytes each).

On-chain verification uses the `groth16-solana` crate, implementing the BN254 pairing check within Solana's compute budget (<200K compute units). The verification program:

1. Validates a challenge nonce (single-use, time-limited to 5 minutes)
2. Executes the Groth16 pairing check
3. If valid: creates a `VerificationResult` PDA as an audit trail
4. If invalid: reverts the entire transaction (challenge nonce preserved for retry)

#### **3.3. Trusted Setup**

Groth16 requires a structured reference string (SRS) from a trusted setup ceremony. Phase 1 uses the Hermez community Powers of Tau—multi-contributor, production-grade, circuit-agnostic. Phase 2 currently has a single contributor. A multi-party computation ceremony with ≥10 independent contributors will precede mainnet deployment. The SRS is compromised only if *all* Phase 2 contributors collude [12].

---

### **4. Economic Model**

#### **4.1. The IAM Token**

The protocol's economic security is anchored by a native utility token (SPL Token-2022 with Confidential Balances [13]):

1. **Staking.** Validators stake IAM tokens to participate in the Anonymity Ring.
2. **Verification capacity.** Integrators stake IAM for discounted or unlimited verifications via capacity tiers.
3. **Governance.** Token holders vote on protocol parameters.

#### **4.2. Integrator-Pays Model**

Users never pay. The integrating application deposits SOL, USDC, or staked IAM into a protocol escrow. Each verification costs approximately $0.01—the relayer submits the on-chain transaction and deducts from the integrator's balance. This follows the pricing model of existing verification services (reCAPTCHA Enterprise, hCaptcha, Cloudflare Turnstile).

#### **4.3. Validation Cycle**

A margin on each verification (~$0.007) is collected into the protocol treasury. The treasury purchases IAM from the open market and distributes rewards to honest validators, creating buy pressure proportional to real verification volume.

#### **4.4. Slashing**

The design specifies a probabilistic audit mechanism: a configurable fraction of successful validations would trigger a secondary audit by an independent Anonymity Ring, with disagreement resulting in slashing of the primary Ring's stakes. This mechanism is specified but not yet implemented in the current devnet deployment.

---

### **5. The IAM Anchor**

#### **5.1. Non-Transferable Identity Token**

The IAM Anchor is implemented using SPL Token-2022 with the `NonTransferable` mint extension. Each wallet maps to exactly one Anchor via a Program Derived Address (PDA).

The on-chain data structure stores: `owner` (Pubkey), `creation_timestamp` (i64), `last_verification_timestamp` (i64), `verification_count` (u32), `trust_score` (u16), `current_commitment` ([u8;32]), and a rolling window of the 10 most recent verification timestamps for Trust Score computation.

#### **5.2. Progressive Trust Score**

The Trust Score rewards consistency over time, not volume. A bot verifying 100 times in one day scores lower than a human verifying weekly for months. The formula combines three components:

**Recency-weighted count.** Each of the last 10 verification timestamps contributes `3000 / (30 + d_i)` where `d_i` is the number of days since that verification, multiplied by a protocol-configurable base increment.

**Regularity bonus.** The standard deviation of inter-verification gaps is computed. Lower variance yields a higher bonus (up to 20 points), rewarding regular spacing.

**Age bonus.** `⌊√min(age_days, 365)⌋ × 2`, using deterministic integer square root. Diminishing returns prevent gaming via old unused accounts.

The score is capped at a configurable maximum (currently 10,000) and computed on-chain during the `update_anchor` instruction, reading parameters from a cross-program PDA.

#### **5.3. Walletless Mode**

The default flow requires no wallet. The user completes the behavioral challenge; the Pulse SDK generates the ZK proof; the relayer submits it on-chain using the integrator's escrow. The behavioral fingerprint is stored locally (encrypted with AES-256-GCM, key as non-extractable `CryptoKey` in IndexedDB) for future re-verification. The identity is device-bound and ephemeral—clearing storage resets it.

Wallet-connected mode produces a persistent, portable identity. The user signs the transaction directly, mints an IAM Anchor, and builds an on-chain Trust Score queryable by any integrator.

---

### **6. Security Analysis**

#### **6.1. Threat Model**

**Definition 2 (Adversary).** *We consider a computationally-bounded adversary A with the following capabilities:*

1. *A has full access to the protocol source code, circuit definitions, and feature extraction pipeline (open source).*
2. *A can generate arbitrary synthetic sensor data (audio, motion, touch) and submit it through the Pulse SDK.*
3. *A can create arbitrary Solana wallets and fund them with SOL.*
4. *A cannot break the discrete logarithm assumption on BN254, the collision resistance of Poseidon, or the knowledge soundness of Groth16.*
5. *A cannot access another user's device storage (no physical access to encrypted fingerprints).*

#### **6.2. Replay Attacks**

**Theorem 1 (Replay Resistance).** *An adversary replaying a previously-captured fingerprint F_T verbatim is rejected except with negligible probability, under the knowledge soundness of Groth16.*

*Proof.* A replayed fingerprint produces `d_H(F_T, F_T) = 0 < δ_min = 3`. The circuit outputs `false` for the range check `δ_min ≤ d_H < δ_max`. By the knowledge soundness of Groth16, no valid proof exists for a false statement. The on-chain verifier rejects the transaction. Additionally, challenge nonces are single-use and time-limited (5 minutes), preventing replay of the proof itself. ∎

#### **6.3. Synthetic Data Attacks**

**Claim 1 (Multi-Modal Synthesis Difficulty).** *An adversary must simultaneously synthesize realistic data across all three modalities (voice, motion, touch) such that the fused 134-dimensional feature vector produces a SimHash fingerprint within Hamming distance δ_max of the target.*

The defense is layered:

**Feature-level.** The 134-dimensional feature vector captures involuntary biological processes: vocal jitter/shimmer from laryngeal muscle micro-contractions, kinematic jerk from neuromuscular control loops, touch pressure from fingertip biomechanics. Each dimension presents a distinct synthesis challenge. Jitter measures, for instance, capture perturbation rates that TTS engines produce with unnaturally low variance [11].

**Cross-modal correlation.** SimHash projects the concatenated vector onto shared hyperplanes. Each output bit depends on features from all modalities jointly. An adversary cannot spoof modalities independently—the cross-modal correlations must be consistent.

**Entropy scoring.** The extraction pipeline measures Shannon entropy and jitter variance per sensor stream. Synthetic data with low or uniform entropy is flagged before reaching the hashing stage.

We do not claim synthesis is impossible. We claim it is expensive relative to the value extractable from most Sybil attacks, and that this cost increases with the number of identities maintained over time.

**Empirical context.** Serwadda and Phoha [17] demonstrated that spoofing mouse dynamics—even with full knowledge of the target's behavioral profile—required extensive per-target training and achieved limited success rates. IAM requires spoofing three modalities simultaneously. Under an independence assumption, if single-modality spoofing succeeds with probability p_v (voice), p_m (motion), and p_t (touch), the joint success rate is p_v · p_m · p_t. Even generous estimates of 0.3 per modality yield ~2.7% joint success per attempt.

**Voice modality resilience.** Modern text-to-speech systems can clone voice timbre from seconds of reference audio. However, IAM's voice features specifically target involuntary laryngeal micro-perturbations (jitter, shimmer, HNR) rather than perceptual voice quality. ASVspoof challenge results [11] confirm that TTS outputs exhibit unnaturally low jitter variance and unnaturally high HNR compared to natural speech. While this gap is narrowing as synthesis quality improves, the multi-modal fusion ensures that voice is one signal among three, not a single point of failure. Behavioral biometric systems using ZK verification have independently demonstrated practical false accept rates below 1% [18].

#### **6.4. Sybil Attacks**

Each wallet maps to exactly one IAM Anchor (enforced by PDA derivation). Creating k fake identities requires:

1. k funded Solana wallets (SOL cost)
2. k independent behavioral profiles, each sustained across regular re-verifications
3. k × m verification fees over m re-verification cycles

The Trust Score penalizes new accounts (age bonus starts at 0) and irregular patterns (regularity bonus requires consistent spacing). An adversary building 1,000 identities with Trust Score > 500 over 3 months incurs costs that exceed the value of most airdrop allocations.

#### **6.5. Privacy**

**Theorem 2 (Zero-Knowledge Privacy).** *The on-chain verifier learns only that the Hamming distance between two fingerprints falls within [δ_min, δ_max). It learns neither fingerprint, neither salt, nor any feature vector.*

*Proof.* By the zero-knowledge property of Groth16, the proof reveals nothing beyond the truth of the statement. The public inputs are Poseidon commitments (computationally hiding under the discrete logarithm assumption on BN254) and the threshold parameters. The fingerprints and salts are private witnesses. ∎

Raw biometric data is destroyed after feature extraction. On-chain, only the Poseidon commitment is stored—computationally hiding under standard assumptions.

**SimHash reversibility.** Recent work has demonstrated pre-image attacks on locality-sensitive hashes [21], showing that SimHash fingerprints contain recoverable information about the original input. IAM's architecture addresses this at two levels: (1) the SimHash fingerprint is never transmitted or stored on-chain—only the Poseidon commitment is public, and the ZK proof reveals nothing beyond the Hamming distance range; (2) the fingerprint stored locally for re-verification is encrypted with AES-256-GCM using a non-extractable `CryptoKey` in IndexedDB, requiring device-level compromise to access. SimHash is not relied upon as a privacy-preserving representation; the Poseidon commitment provides that property.

#### **6.6. Economic Sustainability of Attacks**

The protocol does not claim to make spoofing impossible. It claims to make sustained spoofing *economically irrational* relative to the value it extracts. The defense is layered:

* **Feature-level:** Realistic multi-modal sensor data across 134 dimensions is hard to synthesize.
* **Circuit-level:** Replays (d_H = 0) and imposters (d_H > δ_max) are rejected.
* **Entropy scoring:** Low-entropy synthetic data is flagged before hashing.
* **Economic:** Each verification costs SOL. Each wallet requires funding. Trust Score rewards months of consistency over bursts.

#### **6.7. Graduated Trust Model**

First-time verification establishes a behavioral baseline. With no prior fingerprint, the Hamming distance circuit does not fire. The protocol functions as a multi-modal liveness check, relying on feature extraction quality to distinguish human from synthetic data.

Temporal consistency applies from the second verification onward. Each returning session checks behavioral drift against the stored fingerprint.

**Definition 3 (Trust Tiers).** *The protocol defines three trust tiers based on verification history:*

1. **Liveness** *(first walletless verification). Multi-modal sensor data was captured from a likely human. No temporal consistency. Signal strength: low. Suitable for captcha-equivalent use cases.*
2. **Device-bound consistency** *(returning walletless verification). Behavioral drift matches a device-local fingerprint. Signal strength: medium. Suitable for session authentication, content gating.*
3. **Portable identity** *(wallet-connected with Trust Score). Persistent on-chain Anchor with months of behavioral consistency visible to all integrators. Signal strength: high. Suitable for airdrop eligibility, DAO governance, DeFi access controls.*

In walletless mode, the integrator funds verifications via escrow and controls abuse exposure through per-IP rate limiting, minimum Trust Score requirements, and escrow budget caps. This mirrors existing verification service pricing models [8]. The protocol provides the signal; the integrator sets the threshold.

A bot that clears local storage before each walletless verification is perpetually at Tier 1—a liveness check with no temporal history. High-value integrations can require Tier 2 or Tier 3, making this strategy ineffective for anything beyond basic captcha equivalence.

---

### **7. Related Work**

**Worldcoin** [5] uses iris scanning to create a unique biometric identifier per person. The approach requires custom hardware (the Orb), stores a permanent biometric template, and has been banned or restricted in 12+ jurisdictions. Unlike IAM, the biometric is static—a compromised iris scan is compromised forever.

**BrightID** [6] verifies uniqueness through social graph analysis. Users vouch for each other in verification parties. The system is vulnerable to coordinated collusion and requires social coordination that limits adoption.

**Reclaim Protocol** [7] proves ownership of existing web2 accounts via TLS session proofs. It answers "do you control this account?"—not "are you human?" IAM and Reclaim are complementary: Reclaim proves account ownership, IAM proves the account owner is human.

**Traditional CAPTCHA** (reCAPTCHA [8], hCaptcha, Turnstile) provides session-level bot detection using behavioral signals, browser fingerprinting, and centralized machine learning classifiers. The advantages are maturity and a vast training dataset (Google processes billions of sessions). The disadvantages are privacy concerns (behavioral data sent to Google), lack of identity persistence (no concept of "the same human returning"), binary output (pass/fail with no graduated trust), and vulnerability to captcha-solving services. IAM's first walletless verification provides comparable liveness detection; its graduated trust model provides capabilities CAPTCHA fundamentally cannot.

**VeryAI** uses palm print biometrics with on-device processing. Similar to IAM in privacy preservation (biometric stays on-device), but uses a static biometric with the same permanence limitations as iris scanning. No temporal consistency component.

**Behavioral biometrics with ZK proofs.** Hamm et al. [18] demonstrate continuous authentication using interactive and non-interactive ZK proofs over behavioral features, achieving a false accept rate of 0.65% and false reject rate of 0.48%. Their system validates that ZK verification of behavioral biometrics is practical, though their architecture targets session-level continuous authentication rather than cross-session identity persistence. Multi-modal fusion approaches for behavioral authentication [20] confirm that combining touch, keystroke, and accelerometer data improves both accuracy and spoofing resistance over single-modality systems.

**Formal frameworks for proof of personhood.** Choudhuri et al. [19] provide the first rigorous cryptographic formalization of proof of personhood, defining ideal functionalities for Sybil-resistance, authenticated personhood, and unlinkability. Their framework assumes trusted authorities issue personhood credentials. IAM derives personhood from behavioral biometrics without a trusted issuer, which is more decentralized but harder to formalize under their model. Mapping IAM's security properties to this framework is identified as future work.

**Worldcoin regulatory outcomes.** As of March 2026, Worldcoin (rebranded as World Network) has been banned, suspended, or fined in 10+ jurisdictions including Portugal, Germany, South Korea, Brazil, and Thailand [23]. Every enforcement action cited the collection, storage, or transfer of biometric data. IAM's architecture—where raw biometric data never leaves the user's device and the ZK proof is the only output—is designed to avoid these regulatory triggers.

---

### **8. Implementation and Benchmarks**

The protocol is deployed on Solana devnet with five components: three Anchor/Rust on-chain programs with full constraint validation and on-chain Trust Score; a Groth16/Circom circuit (1,996 constraints) with trusted setup; the Pulse SDK (TypeScript, published on npm, 52 tests); an executor node (Rust, live on Railway) providing the relayer API with rate limiting and commitment registry; and a demo application (Next.js on Vercel) with walletless and wallet-connected flows.

#### **8.1. Performance Benchmarks**

Benchmarks measured on Chrome 132 (M1 MacBook Pro) and Safari (iPhone 15 Pro Max):

* Behavioral capture: 7,000–12,000 ms (configurable)
* Feature extraction (134 dimensions): ~45 ms
* SimHash (256-bit): <1 ms
* Poseidon commitment: ~3 ms
* Groth16 proof generation (WASM): ~850 ms
* On-chain verification: ~180K compute units
* **Total (excluding capture): ~900 ms**

The total pipeline from button click to on-chain proof takes approximately 11–16 seconds depending on the configured capture window, plus ~900 ms of computation. On mobile (iPhone 15 Pro Max, Safari), all three sensor streams (audio, IMU motion, touch) capture simultaneously. Audio captures at the device-native 48 kHz and is processed identically. Proof generation completes within the same time budget via snarkjs WASM.

**Comparative context.** Groth16 proof generation at ~850 ms compares favorably to PLONK-based systems, which require ~2.5s for equivalent circuit sizes [22]. On-chain verification at ~180K compute units fits within Solana's 200K default budget; PLONK verification would exceed it. Poseidon commitment at ~3 ms reflects the hash's ZK-optimized design (~300 R1CS constraints vs. ~25,000 for SHA-256 in-circuit [3]).

---

### **9. Conclusion and Future Work**

The IAM Protocol presents a framework for Proof-of-Humanity through temporal behavioral consistency. By measuring bounded, chaotic drift in multi-modal biometric signals over time, it provides graduated trust guarantees that static biometrics and session-level captcha cannot.

The protocol is honest about its limitations. First-time verification is a liveness check, not a temporal consistency proof. The graduated trust model makes this explicit rather than presenting a false binary. The defense against sophisticated synthesis attacks is economic, not absolute—sustained spoofing at scale costs more than it extracts.

**Future work:**

* Multi-contributor trusted setup ceremony for Groth16 Phase 2 before mainnet.
* External security audit of all on-chain programs, the ZK circuit, and the executor node.
* IAM utility token: SPL Token-2022 with Confidential Balances for validator staking, capacity tiers, and governance.
* Cross-chain deployment to Ethereum L2s after Solana mainnet stabilizes.
* Formal analysis of SimHash collision probability bounds under adversarial feature distributions.

The protocol is open source and published as a defensive disclosure to establish prior art. Source code, circuit definitions, and SDK are available at `github.com/iam-protocol`.

---

### **References**

1. Douceur, J. R. "The Sybil Attack." *Proc. IPTPS*, 2002.
2. Charikar, M. S. "Similarity estimation techniques from rounding algorithms." *Proc. STOC*, 2002.
3. Grassi, L., Khovratovich, D., Rechberger, C., Roy, A., and Schofnegger, M. "Poseidon: A new hash function for zero-knowledge proof systems." *Proc. USENIX Security*, 2021.
4. Groth, J. "On the size of pairing-based non-interactive arguments." *Proc. EUROCRYPT*, 2016.
5. World Foundation. "World Whitepaper," 2023. https://whitepaper.world.org
6. BrightID. "BrightID: A decentralized, open-source social identity network," 2020. https://brightid.org
7. Reclaim Protocol. "Reclaim Protocol Documentation," 2024. https://docs.reclaimprotocol.org
8. Google. "reCAPTCHA Enterprise Documentation," 2023. https://cloud.google.com/security/products/recaptcha
9. Makhoul, J. "Linear prediction: A tutorial review." *Proc. IEEE*, vol. 63, no. 4, pp. 561-580, 1975.
10. Shen, C., Cai, Z., and Guan, X. "Continuous authentication for mouse dynamics: A pattern-growth approach." *Proc. IEEE/IFIP DSN*, 2012.
11. Wang, X., Yamagishi, J., Todisco, M., et al. "ASVspoof 2019: A large-scale public database of synthesized, converted and replayed speech." *Computer Speech & Language*, vol. 64, 2020.
12. Bowe, S., Gabizon, A., and Miers, I. "Scalable multi-party computation for zk-SNARK parameters in the random beacon model." *IACR ePrint 2017/1050*, 2017.
13. Solana Labs. "SPL Token-2022 Program," 2023. https://github.com/solana-program/token-2022
14. Dodis, Y., Reyzin, L., and Smith, A. "Fuzzy extractors: How to generate strong keys from biometrics and other noisy data." *Proc. EUROCRYPT*, 2004.
15. Ratha, N. K., Connell, J. H., and Bolle, R. M. "Enhancing security and privacy in biometrics-based authentication systems." *IBM Systems Journal*, vol. 40, no. 3, pp. 614-634, 2001.
16. Fuller, B., et al. "Fuzzy extractors are practical: Cryptographic strength key derivation from the iris." *Proc. ACM CCS*, 2025. IACR ePrint 2024/100.
17. Serwadda, A. and Phoha, V. V. "When kids' toys breach mobile phone security." *Proc. ACM CCS*, 2013.
18. Hamm, D., Kupris, E., and Schreck, T. "Always authenticated, never exposed: Continuous authentication via zero-knowledge proofs." *Proc. STM*, Springer, 2025.
19. Choudhuri, A. R., Garg, S., Lee, K., Montgomery, H., Policharla, G. V., and Sinha, R. "A cryptographic framework for proof of personhood." *IACR ePrint 2026/333*, 2026.
20. Mahfouz, A., Mostafa, H., Mahmoud, T. M., et al. "M2auth: A multimodal behavioral biometric authentication using feature-level fusion." *Neural Computing and Applications*, vol. 36, pp. 21781-21799, 2024.
21. Paik, S., Hwang, C., Kim, S., and Seo, J. H. "On the reversibility of locality-sensitive hashing-based biometric template protections." *IEEE Trans. Dependable and Secure Computing*, 2025.
22. Gabizon, A., Williamson, Z. J., and Ciobotaru, O. "PLONK: Permutations over Lagrange-bases for oecumenical noninteractive arguments of knowledge." *IACR ePrint 2019/953*, 2019.
23. "Countries that have banned or investigated Worldcoin." BitPinas, 2026. https://bitpinas.com/learn-how-to-guides/list-countries-banned-investigated-worldcoin/
