import type { VerifyState, VerifyAction } from "./types";

export const initialState: VerifyState = { step: "idle" };

export function verifyReducer(
  state: VerifyState,
  action: VerifyAction
): VerifyState {
  switch (action.type) {
    case "START_AUDIO":
      if (state.step !== "idle") return state;
      return { step: "capturing", stage: "audio" };

    case "NEXT_STAGE":
      if (state.step !== "capturing") return state;
      if (state.stage === "audio") return { step: "capturing", stage: "motion" };
      if (state.stage === "motion") return { step: "capturing", stage: "touch" };
      return state;

    case "CAPTURE_DONE":
      if (state.step !== "capturing" || state.stage !== "touch") return state;
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
      return { step: "failed", error: action.error };

    case "RESET":
      return { step: "idle" };

    default:
      return state;
  }
}
