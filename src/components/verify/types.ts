export type VerifyState =
  | { step: "idle" }
  | { step: "challenge"; timeRemaining: number }
  | { step: "proving" }
  | { step: "signing" }
  | { step: "verified"; commitment: string; txSignature?: string }
  | { step: "failed"; error: string };

export type VerifyAction =
  | { type: "START_CHALLENGE" }
  | { type: "TICK"; timeRemaining: number }
  | { type: "CHALLENGE_COMPLETE" }
  | { type: "PROOF_COMPLETE" }
  | { type: "SIGN_COMPLETE"; txSignature: string }
  | { type: "VERIFICATION_SUCCESS"; commitment: string; txSignature?: string }
  | { type: "VERIFICATION_FAILED"; error: string }
  | { type: "RESET" };

export type VerifyMode = "walletless" | "wallet-connected";
