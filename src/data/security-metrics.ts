export interface CampaignResult {
  tier: string;
  description: string;
  attempts: string;
  passRate: string;
  status: string;
  note?: string;
}

export const campaignResults: CampaignResult[] = [
  {
    tier: "T1",
    description: "Procedural synthesis",
    attempts: "2,000",
    passRate: "0%",
    status: "hardened · 2026-03",
  },
  {
    tier: "T2",
    description: "Multi-strategy parameter variation",
    attempts: "4,000",
    passRate: "0%",
    status: "hardened · 2026-03",
  },
  {
    tier: "T3a",
    description: "Unconstrained feature optimization",
    attempts: "1,000",
    passRate: "0%",
    status: "hardened · 2026-04",
  },
  {
    tier: "T3b",
    description: "Constrained feature optimization",
    attempts: "9,000",
    passRate: "0%",
    status: "hardened · 2026-04",
    note: "Campaign surfaced a gap in server-side feature validation. Hardened — see AUDIT.md.",
  },
  {
    tier: "T4a — Wave 1",
    description: "Pre-recorded human voice + procedural motion/touch (temporal enforcement OFF — log-only)",
    attempts: "50",
    passRate: "100%",
    status: "counterfactual baseline",
  },
  {
    tier: "T4a — Wave 2",
    description: "Pre-recorded human voice + procedural motion/touch (temporal enforcement ON)",
    attempts: "10",
    passRate: "10%",
    status: "production enforcement truth",
    note: "Cross-program binding gap in update_anchor discovered during cross-analysis, patched same day — see AUDIT.md protocol-core Critical.",
  },
  {
    tier: "T4b",
    description: "Modern voice cloning (XTTS-v2, F5-TTS)",
    attempts: "—",
    passRate: "queued",
    status: "next-phase",
  },
  {
    tier: "T5",
    description: "Coupled cross-modal synthesis",
    attempts: "—",
    passRate: "queued",
    status: "next-phase",
  },
  {
    tier: "T6",
    description: "Targeted human-mimicry / identity theft",
    attempts: "—",
    passRate: "queued",
    status: "next-phase",
  },
  {
    tier: "T7",
    description: "Replay-perturbed",
    attempts: "—",
    passRate: "queued",
    status: "next-phase",
  },
  {
    tier: "T8",
    description: "Adaptive probing",
    attempts: "—",
    passRate: "queued",
    status: "post-mainnet",
  },
];

export const lastUpdated = "April 20, 2026";

export const t4aNote =
  "T4a was designed as a two-wave study to measure the cross-modal temporal coupling layer's specific contribution to the multi-layer defense. Wave 1 ran with temporal enforcement in log-only mode to establish the counterfactual baseline. Wave 2 ran with enforcement enabled. The 90 percentage-point reduction isolates that layer's contribution. The 10% Wave 2 residual motivates phrase-binding via server-side speech-to-text as the next defense layer.";

export const onChainBurstNote =
  "The 60 IAM Anchors currently visible on devnet include 57 internal red team artifacts from T4a Waves 1–2 (documented above) and a small number of legitimate team verifications. The public /stats page filters red team wallets via a blocklist; on-chain state is preserved for audit traceability.";
