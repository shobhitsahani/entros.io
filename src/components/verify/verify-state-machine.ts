import type { VerifyState, VerifyAction } from "./types";

export const initialState: VerifyState = { step: "idle" };

export function verifyReducer(
  state: VerifyState,
  action: VerifyAction
): VerifyState {
  switch (action.type) {
    case "START_CHALLENGE":
      if (state.step !== "idle") return state;
      return { step: "challenge", timeRemaining: 7 };

    case "TICK":
      if (state.step !== "challenge") return state;
      return { step: "challenge", timeRemaining: action.timeRemaining };

    case "CHALLENGE_COMPLETE":
      if (state.step !== "challenge") return state;
      return { step: "proving" };

    case "PROOF_COMPLETE":
      if (state.step !== "proving") return state;
      return { step: "signing" };

    case "SIGN_COMPLETE":
      if (state.step !== "signing") return state;
      return { step: "signing" };

    case "VERIFICATION_SUCCESS":
      if (
        state.step !== "proving" &&
        state.step !== "signing"
      )
        return state;
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
