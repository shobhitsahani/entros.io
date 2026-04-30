import type { ReactNode } from "react";

import { CloseButton } from "./close-button";

/**
 * Layout chrome for popup-host pages under /embed/*.
 *
 * Server component. Wraps the popup content in header + footer with
 * a single client island for the close button. Keeps the popup
 * minimal: small wordmark, a close affordance, the slot, and a
 * tiny "powered by entros.io" footer.
 */
export function PopupShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100svh] flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <span className="font-wordmark text-xl tracking-tight text-foreground">
          Entros<span className="text-cyan">.</span>
        </span>
        <CloseButton />
      </header>
      <main className="flex flex-1 items-center justify-center p-8">
        {children}
      </main>
      <footer className="border-t border-border px-5 py-3 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/30">
          powered by entros.io
        </span>
      </footer>
    </div>
  );
}
