"use client";

import { cn } from "@/lib/utils";
import { GlowingEffect } from "./glowing-effect";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowCard({ children, className }: GlowCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border-[0.75px] border-border p-2",
        className
      )}
    >
      <GlowingEffect
        spread={40}
        glow
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
        disabled={false}
      />
      <div className="relative flex h-full flex-col rounded-xl border border-border bg-surface/50 p-8 backdrop-blur-[12px]">
        {children}
      </div>
    </div>
  );
}
