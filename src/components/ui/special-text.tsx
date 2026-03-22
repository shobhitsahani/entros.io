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

function scrambleString(text: string): string {
  const chars: string[] = [];
  for (let i = 0; i < text.length; i++) {
    chars.push(text[i] === " " ? " " : getRandomChar());
  }
  return chars.join("");
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
  const phaseRef = useRef<"idle" | "scramble" | "decrypt">("idle");
  const revealedRef = useRef(0);
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
    const revealed = revealedRef.current;
    const chars: string[] = [];

    for (let i = 0; i < text.length; i++) {
      if (i < revealed) {
        // Already decrypted
        chars.push(text[i]!);
      } else if (text[i] === " ") {
        // Preserve spaces
        chars.push(" ");
      } else {
        // Still garbled — keep randomizing
        chars.push(getRandomChar());
      }
    }

    setDisplayText(chars.join(""));

    // Advance decrypt cursor during decrypt phase
    if (phaseRef.current === "decrypt") {
      stepRef.current++;
      if (stepRef.current % 2 === 0) {
        revealedRef.current++;
      }

      if (revealedRef.current >= text.length) {
        setDisplayText(text);
        setDone(true);
        clearTimers();
      }
    }
  }, [clearTimers]);

  const startAnimation = useCallback(() => {
    phaseRef.current = "scramble";
    revealedRef.current = 0;
    stepRef.current = 0;

    // Immediately show garbled text
    setDisplayText(scrambleString(textRef.current));

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, speed);

    // Begin decrypting after delay (minimum short scramble period)
    const decryptDelay = delay > 0 ? delay * 1000 : speed * 8;
    timeoutRef.current = setTimeout(() => {
      phaseRef.current = "decrypt";
    }, decryptDelay);
  }, [tick, speed, delay]);

  useEffect(() => {
    if (!shouldAnimate || phaseRef.current !== "idle") return;

    timeoutRef.current = setTimeout(startAnimation, 0);

    return clearTimers;
  }, [shouldAnimate, startAnimation, clearTimers]);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  if (done) {
    return (
      <span
        ref={containerRef}
        className={`inline-flex font-mono font-medium ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex font-mono font-medium ${className}`}
    >
      <span className="invisible" aria-hidden="true">
        {children}
      </span>
      <span className="absolute inset-0">
        {displayText}
      </span>
    </span>
  );
}
