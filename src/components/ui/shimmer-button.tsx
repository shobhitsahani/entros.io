import React, { type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "rgba(255, 255, 255, 0.1)",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(255, 255, 255, 0.04)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-foreground/15 px-6 py-3 text-foreground [background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}

        <div
          className={cn(
            "inset-0 absolute size-full",
            "rounded-[inherit] shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transition-shadow duration-300 ease-in-out",
            "group-[:not(:disabled)]:hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-[:not(:disabled)]:active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />

        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
