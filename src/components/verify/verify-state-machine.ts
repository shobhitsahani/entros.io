import type { VerifyState, VerifyAction } from "./types";

export const initialState: VerifyState = { step: "idle" };

export function verifyReducer(
  state: VerifyState,
  action: VerifyAction
): VerifyState {
  switch (action.type) {
    case "START_CAPTURE":
      if (state.step !== "idle") return state;
      return { step: "capturing" };

    case "CAPTURE_DONE":
      if (state.step !== "capturing") return state;
      return { step: "processing" };

    case "PROOF_COMPLETE":
      if (state.step !== "processing") return state;
      return { step: "signing" };

    case "VERIFICATION_SUCCESS":
      if (state.step !== "processing" && state.step !== "signing") return state;
      return {
        step: "verified",
        commitment: action.commitment,
        txSignature: action.txSignature,
      };

    case "VERIFICATION_FAILED":
      if (state.step === "verified") return state;
      return { step: "failed", error: action.error };

    case "RESET":
      return { step: "idle" };

    default:
      return state;
  }
}
