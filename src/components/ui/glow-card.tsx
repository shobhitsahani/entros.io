import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowCard({ children, className }: GlowCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface/50 p-8 md:backdrop-blur-[12px] min-w-0 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
