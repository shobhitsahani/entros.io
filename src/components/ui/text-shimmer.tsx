"use client";

import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: string;
  as?: "p" | "span" | "h1" | "h2" | "h3";
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as = "p",
  className,
}: TextShimmerProps) {
  const hasPrefix = children.startsWith("// ");
  const cls = cn("text-muted", className);

  const content = hasPrefix ? (
    <>
      <span className="text-cyan/60">{"// "}</span>
      {children.slice(3)}
    </>
  ) : (
    children
  );

  if (as === "span") return <span className={cls}>{content}</span>;
  if (as === "h1") return <h1 className={cls}>{content}</h1>;
  if (as === "h2") return <h2 className={cls}>{content}</h2>;
  if (as === "h3") return <h3 className={cls}>{content}</h3>;
  return <p className={cls}>{content}</p>;
}
