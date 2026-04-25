# Entros Protocol — Security & Quality Audit Tracker

Last updated: 2026-04-21

Running log of resolved bugs, hardening items, and known limitations across
the protocol's repositories.

**Continuous adversarial testing methodology and current aggregate results**
are published at [entros.io/security](https://entros.io/security).

**Vulnerability reports:** contact@entros.io (see Responsible Disclosure
below).

---

## Pulse SDK (`@entros/pulse-sdk`)

### Critical

- [x] **Audio extraction replaced** — MFCCs removed. New speaker feature extractor (F0, jitter, shimmer, HNR, formant ratios, LTAS) produces 44 content-independent features. Fixed 2026-03-23.
- [x] **Audio fallback vector length** — Consistent 44-element zero vector on fallback. Fixed 2026-03-23.
- [x] **Empty wasmUrl/zkeyUrl crashes snarkjs** — Added validation before proof generation. Fixed 2026-03-23.
- [x] **Proof serializer missing public signal count check** — Added validation. Fixed 2026-03-23.
- [x] **Relayer submission no timeout** — Added 30s AbortController timeout. Fixed 2026-03-23.
- [x] **Relayer submission trusts `success` field loosely** — Changed to strict `result.success === true`. Fixed 2026-03-23.
- [x] **`verify()` method doesn't await stop promises** — Stop promises now properly chained. Fixed 2026-03-23.
- [x] **Wallet submission returns success when anchor IDL fetch fails** — Added explicit error return when `anchorIdl` is null. Fixed 2026-03-23.
- [x] **Reconstructed previousTBH has dummy `commitmentBytes`** — Now uses `bigintToBytes32()` for proper reconstruction. Fixed 2026-03-23.
- [x] **localStorage stores raw fingerprint in plaintext** — Encrypted with AES-256-GCM via Web Crypto API. Non-extractable CryptoKey stored in IndexedDB. Plaintext fallback with warning when crypto APIs unavailable. Automatic migration of legacy plaintext data. Fixed 2026-03-25.

### High

- [x] **`extractFeatures` zero-fills for missing audio** — Now throws error since audio is mandatory. Fixed 2026-03-23.
- [x] **SimHash hyperplane cache dimension mismatch** — Added warning when feature vector dimension differs from expected 134. Fixed 2026-03-23.
- [x] **`ctx.sampleRate` read after `ctx.close()`** — Captured sampleRate early before async operations. Fixed 2026-03-23.
- [x] **Challenge randomness upgraded to `crypto.getRandomValues()`** — Earlier use of `Math.random()` in phrase and lissajous challenge generators replaced with cryptographic PRNG. Devnet-only exposure. Fixed 2026-03-23.

### Medium

- [x] **Re-verification sends 3 separate transactions** — Batched all 3 into a single atomic transaction with 250K CU budget using `.instruction()` + `wallet.sendTransaction`. One prompt, atomic revert on failure. Fixed 2026-04-10.
- [ ] **`any` types for wallet and connection** — Solana adapter types are optional peer deps, can't be strictly typed without making them required. Documented with eslint-disable comments.
- [x] **`verifyProofLocally` uses Node.js `fs` in browser bundle** — Changed to accept VK object directly, no fs import. Fixed 2026-03-23.
- [x] **`Buffer.from()` in browser-targeted code** — Replaced with `TextEncoder.encode()` and `Uint8Array`. Fixed 2026-03-23.
- [x] **`@solana/spl-token` missing from peerDependencies** — Added as optional peer dependency. Fixed 2026-03-23.
- [x] **`Math.min(...values)` stack overflow for large arrays** — Replaced spread with loop in entropy(). Fixed 2026-03-23.
- [x] **`skipAudio()` API contradicts mandatory audio requirement** — Removed skipAudio(). Audio failure now throws. Fixed 2026-03-23.

### Low

- [x] **No tests for extraction, submission, session, or sensor modules** — Added extraction tests (speaker, motion, touch, mouse dynamics, fusion). Full test suite on pulse-sdk passing. Fixed 2026-03-25.
- [x] **ScriptProcessorNode deprecated** — Documented in audio.ts with migration note for v1.0. All current browsers support it. Fixed 2026-03-25.
- [x] **In-memory localStorage fallback lost on page reload** — Documented in anchor.ts. Private browsing users must re-enroll each session. Fixed 2026-03-25.

### Mainnet Readiness

Items in active design between the current devnet pilot and global production
deployment. All have documented implementation paths in the blueprint folder.

- [~] **Global Sybil detection at scale** — The cross-wallet fingerprint registry's current design is sized for the devnet pilot population. Scaling to global populations moves from a binary pass/fail gate to probabilistic scoring with scoped comparison and ensemble signals (behavioral + attestation + cross-protocol). Phased design in `docs/BLUEPRINT-sybil-at-scale.md`.
- [~] **Wallet migration instruction** — On-chain `migrate_identity` instruction lets users move their identity to a new wallet after proving ownership of the old one. Currently handled in devnet by the registry's 24-hour eviction policy. Production design in `docs/BLUEPRINT-sybil-at-scale.md`.
- [~] **Persistent registry for mainnet** — Migrating cross-wallet state from in-memory storage to database-backed storage. Standard pilot-to-production infrastructure work.

### SDK Error Message Quality (added 2026-04-16)

- [x] **SDK error messages lacked actionable guidance for integrators** — 24 error messages rewritten to include the action the integrator should take next (e.g. "Call stopAudio() before starting a new capture"). Session state-machine errors, audio capture failures, IDL fetch errors, relayer errors, and agent attestation errors all now name the expected next call. Diagnostic context preserved where useful. Shipped in 0.7.12. Fixed 2026-04-16.

### Tier 2 Hardening (added 2026-04-16)

- [x] **Additional server-side verification signal live** — pulse-sdk 0.7.12+ surfaces extra sensor data alongside the 134-feature vector. Validation service computes a per-verification metric, empirically calibrated and enforced at the validation gate. Backward-compat with older SDK versions verified. Fail-closed coverage (non-finite inputs, short captures) in place. Enabled 2026-04-20.

### Baseline Reset Flow (added 2026-04-21)

- [x] **Self-service recovery for users with a lost local baseline** — When a wallet has an on-chain Entros Anchor but the device's encrypted baseline is unrecoverable, re-verification previously had no recovery path short of using a different wallet (losing trust score history). Resolution: new on-chain recovery instruction with a 7-day cooldown, wallet-owner-signed, preserves the Anchor token and anchor creation date while rotating the commitment to a fresh fingerprint and resetting verification counters. Humanness is re-asserted via the same Tier 1 validation pipeline used for normal verification. The `/verify` flow detects the missing-baseline state, surfaces a consequence-explicit confirmation dialog, and runs the reset on confirm. Shipped in pulse-sdk 0.9.0 + entros.io 2026-04-21.

---

## Protocol Core (`protocol-core`)

### Critical — VERIFICATION PIPELINE (requires coordinated cross-repo changes)

These items directly affect the on-chain verification flow. Fixing any one of
them requires rebuilding and redeploying the Anchor programs to devnet,
updating the executor node's instruction builders and PDA derivation if
account contexts change, potentially updating the SDK's wallet submission
path, and regenerating the test fixture. All changes must be tested
end-to-end (browser → SDK → executor → Solana devnet) after deployment. Do
not fix these in isolation.

- [x] **`update_anchor` did not enforce cross-program binding to `verify_proof`** — The client SDK bundled `create_challenge + verify_proof + update_anchor` atomically, but the programs had no internal cross-reference. A direct Solana client could call `update_anchor` alone with any commitment and any nonce, incrementing Trust Score for only the protocol fee. Patched by extending `VerificationResult` with `commitment_new`, `commitment_prev`, `threshold`, `min_distance` (bound-checked in `verify_proof` with high-byte-zero field-element safety). `update_anchor` now requires a matching `VerificationResult` PDA (verifier = authority, freshness, commitment_new matches submitted, commitment_prev matches stored) plus defense-in-depth discriminator + owner checks. Single-use enforced by commitment rotation. pulse-sdk 0.8.0 threads the new account + nonce through the wallet submission path. Fixed 2026-04-20.
- [x] **`update_anchor` lacked ownership constraint** — Added `constraint = identity_state.owner == authority.key() @ EntrosAnchorError::Unauthorized` to UpdateAnchor context. Fixed 2026-03-23.
- [x] **`compute_trust_score` writes nothing on-chain** — Moved trust score computation into `update_anchor` (entros-anchor). Trust score auto-computed from verification history and protocol config on every update. `update_anchor` reads ProtocolConfig via cross-program PDA. Removed `new_trust_score` parameter. `compute_trust_score` in entros-registry remains as a read-only preview instruction. Fixed 2026-03-23.
- [x] **Failed proofs don't revert transaction** — Replaced `.is_ok()` with `?` in verify_proof. Invalid proofs now revert the entire transaction — challenge nonce preserved, no VerificationResult PDA created, no SOL wasted. Executor simplified: tx confirmation implies proof validity. Fixed 2026-03-23.
- [x] **Verification key conversion needs manual verification** — Manual byte-by-byte audit confirmed: all G1 points, G2 points with reversed coordinate ordering, and nr_pubinputs=4 match exactly between verification_key.json and verifying_key.rs. Conversion script is correct. Verified 2026-03-22.

### High

- [x] **Proof hash audit-trail collision resistance strengthened** — XOR fold accumulator replaced with rotate-and-XOR hash. `proof_hash` is used for on-chain audit trail (not proof validation) — collision resistance ensures distinct verifications produce distinct audit entries. Fixed 2026-03-23.
- [x] **Test-only mock verifier module exposed in production builds** — `mock_verifier.rs` (used only by unit tests) was included in release binaries because it lacked a `#[cfg(test)]` gate. Added the gate; production verification path was unaffected throughout. Fixed 2026-03-23.
- [x] **`f64::sqrt()` in trust score is non-deterministic on-chain** — Replaced with deterministic integer sqrt (Newton's method). Fixed 2026-03-23.
- [x] **`Vec::new()` heap allocation in trust score** — Replaced with fixed `[i64; 9]` array. Fixed 2026-03-23.
- [x] **Vault PDA has no unstake instruction** — Added `unstake_validator` instruction. Transfers staked SOL from vault back to validator via System Program CPI with PDA signing. Closes ValidatorState account (returns rent, allows re-registration). Authority constraint prevents unauthorized unstaking. Fixed 2026-03-25.
- [x] **Trust score rewarded burst over consistency** — Same-day verifications inflated recency score linearly. Fixed by deduplicating `recent_timestamps` by calendar day before computing recency and regularity scores. Fixed 2026-04-10.
- [x] **`create_challenge` accepts zero nonces** — Added `require!(nonce != [0u8; 32])` check matching the commitment validation pattern in entros-anchor. Fixed 2026-04-10.
- [ ] **No integration tests for trust score or nonce validation** — Trust score deduplication and nonce zero-check have no anchor test coverage. Assigned to contributor.
- [x] **3 entros-registry tests failing due to test ordering** — `initializes protocol config` wrapped in try/catch for idempotent initialization. Trust score tests updated to match current instruction signature. Fixed 2026-03-25.

### Medium

- [x] **Recency score integer truncation** — Reordered arithmetic to preserve precision. Fixed 2026-04-10.
- [x] **`challenge_expiry` enforced server-side** — ChallengeNonceRegistry on executor enforces configurable TTL (default 60s, `CHALLENGE_TTL_SECS` env var). On-chain 300s `DEFAULT_CHALLENGE_EXPIRY` retained as outer safety bound. Fixed 2026-04-15.
- [x] **`recent_timestamps` capped at 10 entries** — Expanded to 52 timestamp slots with transparent migration for existing accounts. Dashboard updated to read all 52 slots. Fixed 2026-04-12.
- [x] **No `close` instructions for Challenge/VerificationResult accounts** — Added close_challenge and close_verification_result with ownership validation. Fixed 2026-03-23.

---

## Circuits (`circuits`)

### High

- [ ] **Single-contributor trusted setup** — Production needs multi-contributor ceremony. Documented prominently in circuits README with mainnet ceremony plan. Acceptable for devnet, required before mainnet.
- [x] **No verification that ptau is large enough** — setup.sh now verifies constraint count fits within the configured ptau level and exits with error if exceeded. Fixed 2026-03-25.

### Medium

- [x] **Test randomness non-reproducible** — Replaced Math.random/crypto.getRandomValues with seeded Mulberry32 PRNG (SHA-256 of label). All test vectors are deterministic and reproducible across runs. Fixed 2026-03-25.
- [x] **`verifyProof` helper is dead code** — Removed from test_vectors.ts. Tests use snarkjs.groth16.verify directly. Fixed 2026-03-25.

### Low

- [x] **No negative-distance or boundary test cases** — Added tests for min_distance=0, impossible constraint range, and tight boundary. Fixed 2026-03-25.

---

## Executor Node (`executor-node`)

### Critical — VERIFICATION PIPELINE

- [x] **`is_first_verification` is client-controlled** — Server-side CommitmentRegistry tracks seen commitments per API key. If a commitment is already known, executor overrides `is_first_verification` to false regardless of client claim. First verification now returns `verified: null, registered: true`. Fixed 2026-03-23.

### High

- [x] **API key comparison not constant-time** — Replaced with `subtle::ConstantTimeEq`. Fixed 2026-03-23.
- [x] **`CorsLayer::permissive()` allows all origins** — CORS now configurable via `CORS_ORIGINS` env var. Permissive fallback when not configured (development). Fixed 2026-03-25.
- [x] **Rate limiter never evicts old entries** — Added timestamp-based eviction after 5 minutes of inactivity. Fixed 2026-03-23.
- [x] **`remaining_quota` in response is stale after refund** — Added `get_remaining()` method, response uses fresh value. Fixed 2026-03-23.

### Medium

- [x] **`is_valid` byte offset 80 is a magic number** — Extracted to named constant with length validation. Fixed 2026-03-23.
- [x] **Event monitor log parsing is fragile** — Added verifier program ID filter before matching event names. Fixed 2026-03-23.
- [x] **No transaction retry logic** — Added exponential backoff retry (3 attempts) with fresh blockhash per attempt. Fixed 2026-03-23.

### Challenge Security (added 2026-04-15)

- [x] **Server-generated challenges prevent pre-computation** — New `GET /challenge` endpoint issues server-side nonces stored in `ChallengeNonceRegistry` (DashMap, atomic validate-and-consume). SDK fetches nonce before building wallet transaction, falls back to client-generated nonce if executor unreachable. Attestation validates nonce was server-issued and within TTL. Unit tested. Fixed 2026-04-15.

### SAS Integration (added 2026-04-06)

- [x] **`/attest` endpoint verifies wallet ownership** — SDK signs a timestamped attestation message with the connected wallet. Executor verifies ed25519 signature, validates message format and 60-second timestamp window before issuing attestation. Wallets without `signMessage` support fall back to current behavior. Fixed 2026-04-15.
- [x] **SAS credential authority — code complete, key rotation deferred to mainnet** — Executor supports separate `SAS_AUTHORITY_KEYPAIR` env var. Falls back to relayer keypair when not set (current devnet behavior). Before mainnet: generate dedicated SAS authority keypair, store in HSM or separate secrets manager, re-create the SAS credential with the new authority, set `SAS_AUTHORITY_KEYPAIR` on the executor. Fixed (code) 2026-04-15.
- [x] **Agent Anchor hardcodes devnet program ID** — Both `attestAgentOperator` and `getAgentHumanOperator` now accept optional `cluster` parameter and select program ID accordingly. Defaults to devnet for backward compatibility. Fixed 2026-04-15.
- [x] **No rate limiting specific to `/attest`** — Attestation endpoint now has its own rate limiter at 10 requests/min per API key, separate from the general 60/min limit. Fixed 2026-04-15.

### Status Endpoint

- [x] **`/status` endpoint exposes relayer SOL balance publicly** — Unauthenticated requests now return only `{"status": "ok"}`. Full metrics require valid API key. Fixed 2026-04-15.
- [x] **`/status` makes an RPC call on every request** — Balance cached with 30-second TTL. Fixed 2026-04-09.
- [x] **`.unwrap()` in StatusMetrics::new()** — Replaced with `.unwrap_or_default()`. Audited 2026-04-21.

### Body Limit (added 2026-04-16)

- [x] **Request body limit raised from 4KB to 256KB** — Accommodates extended sensor time-series payloads. Rate limiting (60/min per API key, 10/min for /attest) bounds DoS exposure regardless of body size. Fixed 2026-04-16.

---

## entros-validation (private service)

Closed-source server-side validation microservice on Railway. Receives the
134-dimensional feature vector plus cross-modal sensor data from the
executor and applies Tier 1 statistical checks and Tier 2 coupling
signals. Attack code, specific checks, thresholds, and per-check logic are
kept private per responsible-disclosure convention.

### High

- [x] **Statistical gap surfaced during T3b campaign** — Feature-space optimization against the server-side validation pipeline found a narrow exploitable seam across a small subset of probes. Hardened via an additional consistency constraint in the validation service; subsequent campaign attempts rejected. Attack mechanism and specific constraint kept private. Fixed 2026-04-18.
- [x] **Cross-modality correlation check removed** — Discovered 2026-04-20 during T4a Wave 1 log analysis: the check correlated feature-vector statistical summaries at matching index positions across modalities, which is a category error (correlating mean F0 in Hz against mean jerk in m/s³ has no semantic grounding). Observed range on unrelated inputs 0.004–0.881, threshold 0.01 was below noise floor — zero defense value. Removed in iam-validation 2026-04-21. Sound cross-modal defense remains via the temporal coupling check (Pearson on F0 contour × accel magnitude time-series, same-unit same-time). Semantic replacement checks deferred pending human-baseline calibration data.
- [x] **Phrase content binding shipped** — Tier 1 validation now verifies that the audio content matches the server-issued challenge phrase, not just voice texture. Closes the pre-recorded-arbitrary-content attack class (T4a Wave 1 baseline). Combinatorial defense ≈ 4.7 × 10¹⁵ unique phrases per session via random sampling from a curated neutral-vocabulary dictionary. Calibrated discrimination gap ≈ 95 percentage points between right and wrong content across initial verifications; threshold tolerates one transcription word-error per phrase with margin. Fixed 2026-04-25.

---

## Website (`entros.io`)

### High

- [x] **Wallet flow dispatches PROOF_COMPLETE on blind 2s timer** — Now dispatches after actual proof generation. Fixed 2026-03-23.
- [x] **Walletless flow has no timeout on `session.complete()`** — Added 60s timeout via Promise.race. Fixed 2026-03-23.
- [x] **`preparing` state is vestigial** — Removed dead state and conditional. Fixed 2026-03-23.

### Medium

- [x] **No error boundary around PulseChallenge** — Added VerifyErrorBoundary with reset handler. Fixed 2026-03-23.
- [x] **`touchRef` forwarding uses `as any` cast** — Replaced with MutableRefObject type and dependency array. Fixed 2026-03-23.
- [x] **Audio level callback causes ~60 re-renders/sec** — Throttled to every 6th frame (~10/sec). Fixed 2026-03-23.
- [x] **`VERIFICATION_FAILED` has no state guard** — Added guard: won't override verified state. Fixed 2026-03-23.
- [x] **Desktop verification flow broken by double-click race** — Added startingRef re-entry guard and requesting state to handleStart(). Button shows "Requesting access..." during permission dialog. Fixed 2026-03-26.
- [x] **Wallet-connected flow has no timeout on session.complete()** — Added 60s Promise.race timeout matching walletless flow. Fixed 2026-03-26.

---

## Dependency Versions (audited 2026-03-25)

### Actionable Now

- [x] **Website `@coral-xyz/anchor` 0.30.1 behind org standard 0.32.1** — Updated to 0.32.1. Fixed.
- [x] **Website `lucide-react` 0.577 behind v1.x** — Updated to 1.6.0. Fixed.
- [x] **TypeScript 5.x behind 6.0 across all JS/TS repos** — Updated to 6.0 across pulse-sdk, circuits, protocol-core, token-contracts, website. All compile clean. Fixed.
- [ ] **Executor `solana-client`/`solana-sdk` 2.2 behind v4.0** — 4.0 is still beta. Using beta in production is worse than stable 2.2. RPC protocol is backward compatible. Upgrade when 4.0 stable releases.
- [x] **`mocha` 10.x behind 11.x in protocol-core, token-contracts, circuits** — Updated to 11.x across all three repos. Fixed.

### Blocked (Anchor 0.32.1 dependency tree)

- [x] **`spl-token-2022` crate 8.x behind v10.0** — Upgraded to v9 (max compatible with Anchor 0.32.1). Fixed.

### Watch (not actionable yet)

- [ ] **Anchor 1.0.0-rc.5 available** — Release candidate, not stable. Migration from 0.32.x will be significant. Monitor for stable release.
- [ ] **`@solana/kit` (web3.js v2) 6.5 available** — New API replacing `@solana/web3.js`. Ecosystem still migrating. Plan eventual adoption.

### Current (no action needed)

- `groth16-solana` 0.2.0, `snarkjs` 0.7.6, `circomlib` 2.0.5, `circomlibjs` 0.1.7 — all latest
- `meyda` 5.6.3, `pitchfinder` 2.3.4 — latest
- `axum` 0.8, `tower-http` 0.6, `tokio` 1.x, `dashmap` 6 — current major versions
- `react` 19.2.4, `next` 16.2.0, `tailwindcss` v4 — latest
- Rust 1.92, Solana CLI 3.0.13, Node 24, Circom 2.2.3 — all current

---

## Security Program

Continuous adversarial testing against the verification pipeline is conducted
via an internal red team harness implementing multiple tiers of attack
sophistication, from baseline procedural synthesis through advanced
generative techniques. Attack code, per-attempt telemetry, and specific
parameter values are kept private per responsible-disclosure convention.

Public methodology, tier taxonomy, and current aggregate results are
published at [entros.io/security](https://entros.io/security).

A public baseline test suite at `pulse-sdk/test/pentest.test.ts` exercises
trivial attacker capability (procedural sine-wave synthesis) and is retained
for reproducibility. It is not representative of the full threat model the
private harness addresses.

---

## Responsible Disclosure

Report vulnerabilities to contact@entros.io. We aim to acknowledge within
48 hours and provide initial triage within 5 business days. Good-faith
security research is welcome within the scope of the security program. We do
not pursue legal action against researchers acting in good faith.

---

## Methodology

Findings are categorized as:

- **Critical**: will cause incorrect behavior, security failures, or data loss
- **High**: correctness issues, silent failures, fragile patterns
- **Medium**: type safety, code quality, maintainability
- **Low**: minor issues, test gaps, documentation
- **Mainnet Readiness**: items in active design between current devnet pilot and global production deployment

Items are checked off `[x]` when fixed and verified. Date of fix is noted in commit history.
