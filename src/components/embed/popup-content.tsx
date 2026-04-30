"use client";

import type { ParsedEmbedParams } from "@/lib/embed/url-params";

/**
 * Client component that owns the popup's interactive verification
 * surface. Currently a placeholder with a parameter readout. The
 * actual pipeline composition (capture, ZK proof, on-chain mint,
 * postMessage emission to the opener) lands in subsequent commits.
 */
export function PopupContent({ params }: { params: ParsedEmbedParams }) {
  return (
    <div className="text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        // POPUP READY
      </p>
      <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-foreground md:text-3xl">
        Verification will run here<span className="text-cyan">.</span>
      </h1>
      <p className="mt-4 text-xs leading-relaxed text-foreground/55">
        Pipeline composition lands in subsequent commits on this branch.
      </p>
      <dl className="mx-auto mt-6 grid max-w-xs grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-left font-mono text-[11px] text-foreground/45">
        <dt>integrator</dt>
        <dd className="text-foreground/70">{params.integratorKey}</dd>
        <dt>cluster</dt>
        <dd className="text-foreground/70">{params.cluster}</dd>
        <dt>parent</dt>
        <dd className="truncate text-foreground/70">{params.parentOrigin}</dd>
        <dt>request</dt>
        <dd className="truncate text-foreground/70">{params.requestId}</dd>
        {params.minTrustScore !== undefined && (
          <>
            <dt>floor</dt>
            <dd className="text-foreground/70">{params.minTrustScore}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
