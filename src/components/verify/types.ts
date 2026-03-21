export type CaptureStage = "audio" | "motion" | "touch";

export type VerifyState =
  | { step: "idle" }
  | { step: "capturing"; stage: CaptureStage }
  | { step: "processing" }
  | { step: "signing" }
  | { step: "verified"; commitment: string; txSignature?: string }
  | { step: "failed"; error: string };

export type VerifyAction =
  | { type: "START_AUDIO" }
  | { type: "NEXT_STAGE" }
  | { type: "CAPTURE_DONE" }
  | { type: "PROOF_COMPLETE" }
  | { type: "VERIFICATION_SUCCESS"; commitment: string; txSignature?: string }
  | { type: "VERIFICATION_FAILED"; error: string }
  | { type: "RESET" };

export type VerifyMode = "walletless" | "wallet-connected";
