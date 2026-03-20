"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface SpecialTextProps {
  children: string;
  speed?: number;
  delay?: number;
  className?: string;
  inView?: boolean;
  once?: boolean;
}

const RANDOM_CHARS = "_!X$0-+*#";

function getRandomChar(prevChar?: string): string {
  let char: string;
  do {
    char = RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)]!;
  } while (char === prevChar);
  return char;
}

export function SpecialText({
  children,
  speed = 20,
  delay = 0,
  className = "",
  inView = false,
  once = true,
}: SpecialTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once, margin: "-100px" });
  const shouldAnimate = inView ? isInView : true;
  const [displayText, setDisplayText] = useState<string>(" ".repeat(children.length));
  const [done, setDone] = useState(false);

  const textRef = useRef(children);
  const phaseRef = useRef<"idle" | "phase1" | "phase2">("idle");
  const stepRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    textRef.current = children;
  }, [children]);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const text = textRef.current;

    if (phaseRef.current === "phase1") {
      const maxSteps = text.length * 2;
      const currentLength = Math.min(stepRef.current + 1, text.length);
      const chars: string[] = [];

      for (let i = 0; i < currentLength; i++) {
        const prev = i > 0 ? chars[i - 1] : undefined;
        chars.push(getRandomChar(prev));
      }
      for (let i = currentLength; i < text.length; i++) {
        chars.push("\u00A0");
      }

      setDisplayText(chars.join(""));
      stepRef.current++;

      if (stepRef.current >= maxSteps) {
        phaseRef.current = "phase2";
        stepRef.current = 0;
      }
    } else if (phaseRef.current === "phase2") {
      const revealedCount = Math.floor(stepRef.current / 2);
      const chars: string[] = [];

      for (let i = 0; i < revealedCount && i < text.length; i++) {
        chars.push(text[i]!);
      }
      if (revealedCount < text.length) {
        chars.push(stepRef.current % 2 === 0 ? "_" : getRandomChar());
      }
      for (let i = chars.length; i < text.length; i++) {
        chars.push(getRandomChar());
      }

      setDisplayText(chars.join(""));
      stepRef.current++;

      if (stepRef.current >= text.length * 2) {
        setDisplayText(text);
        setDone(true);
        clearTimers();
      }
    }
  }, [clearTimers]);

  const startAnimation = useCallback(() => {
    phaseRef.current = "phase1";
    stepRef.current = 0;
    setDisplayText(" ".repeat(textRef.current.length));

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, speed);
  }, [tick, speed]);

  useEffect(() => {
    if (!shouldAnimate || phaseRef.current !== "idle") return;

    if (delay <= 0) {
      // Use microtask to avoid synchronous setState in effect
      timeoutRef.current = setTimeout(startAnimation, 0);
    } else {
      timeoutRef.current = setTimeout(startAnimation, delay * 1000);
    }

    return clearTimers;
  }, [shouldAnimate, delay, startAnimation, clearTimers]);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex font-mono font-medium ${className}`}
    >
      {/* Invisible placeholder reserves the final text dimensions */}
      <span className="invisible" aria-hidden="true">
        {children}
      </span>
      {/* Animated text positioned on top */}
      <span className="absolute inset-0">
        {done ? children : displayText}
      </span>
    </span>
  );
}
