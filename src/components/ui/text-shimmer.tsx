"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
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
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  const sharedProps = {
    className: cn(
      "relative inline-block bg-[length:250%_100%,auto] bg-clip-text",
      "text-transparent [--base-color:#6B6B7B] [--base-gradient-color:#00F0FF]",
      "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
      className
    ),
    initial: { backgroundPosition: "100% center" },
    animate: { backgroundPosition: "0% center" },
    transition: {
      repeat: Infinity,
      duration,
      ease: "linear" as const,
    },
    style: {
      "--spread": `${dynamicSpread}px`,
      backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
    } as React.CSSProperties,
  };

  if (as === "span") return <motion.span {...sharedProps}>{children}</motion.span>;
  if (as === "h1") return <motion.h1 {...sharedProps}>{children}</motion.h1>;
  if (as === "h2") return <motion.h2 {...sharedProps}>{children}</motion.h2>;
  if (as === "h3") return <motion.h3 {...sharedProps}>{children}</motion.h3>;
  return <motion.p {...sharedProps}>{children}</motion.p>;
}
