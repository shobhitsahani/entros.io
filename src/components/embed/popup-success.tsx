"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

// Matches PopupFailure timing for visual symmetry. Long enough for the
// user to register the confirmation; short enough that the post-12s-capture
// flow doesn't feel sluggish at the end.
const CLOSE_DELAY_MS = 2500;

const closePopupWindow = () => {
  if (typeof window !== "undefined") window.close();
};

/**
 * Success surface for the popup. Renders a brief confirmation, then closes
 * the window. The verified postMessage is emitted by the parent before
 * this surface mounts; the close is purely UX.
 *
 * `onClose` defaults to a module-stable `window.close` reference so the
 * timeout fires once at `CLOSE_DELAY_MS` regardless of how many times the
 * parent re-renders. Tests can pass a stub.
 */
export function PopupSuccess({
  onClose = closePopupWindow,
}: {
  onClose?: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, CLOSE_DELAY_MS);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="text-center space-y-4">
      <CheckCircle className="mx-auto h-12 w-12 text-solana-green" />
      <p className="font-mono text-sm text-foreground">Verified.</p>
      <p className="text-xs text-foreground/55">
        Returning you to the integrator...
      </p>
    </div>
  );
}
