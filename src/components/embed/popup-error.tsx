/**
 * Opaque error surface for the popup.
 *
 * Server component. Surfaces a single generic message regardless of
 * the underlying rejection reason. Specific reasons stay server-side
 * per the public-copy specificity rule.
 */
export function PopupError() {
  return (
    <div className="text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        // ERROR
      </p>
      <p className="mt-4 text-sm text-foreground/70">
        This integration is not authorized.
      </p>
    </div>
  );
}
