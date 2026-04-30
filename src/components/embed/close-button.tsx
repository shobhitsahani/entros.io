"use client";

/**
 * Tiny client component for the popup close button. Extracted so the
 * surrounding `PopupShell` can stay a server component while the close
 * action (which needs `window.close`) remains client-side.
 */
export function CloseButton() {
  return (
    <button
      type="button"
      onClick={() => window.close()}
      className="font-mono text-xs text-foreground/40 transition-colors hover:text-foreground"
      aria-label="Close"
    >
      ×
    </button>
  );
}
