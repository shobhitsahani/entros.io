"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

// Track client mount state without triggering re-render via useEffect + setState.
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className={cn("h-8 w-16", className)} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      className={cn(
        "flex h-8 w-16 cursor-pointer items-center rounded-full p-1 transition-all duration-300",
        isDark
          ? "border border-white/10 bg-surface"
          : "border border-zinc-300 bg-white",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="flex w-full items-center justify-between">
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300",
            isDark
              ? "translate-x-0 bg-white/10"
              : "translate-x-8 bg-zinc-200"
          )}
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-white" strokeWidth={1.5} />
          ) : (
            <Sun className="h-4 w-4 text-zinc-700" strokeWidth={1.5} />
          )}
        </div>
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300",
            isDark ? "bg-transparent" : "-translate-x-8"
          )}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-muted" strokeWidth={1.5} />
          ) : (
            <Moon className="h-4 w-4 text-zinc-900" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </button>
  );
}
