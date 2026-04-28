"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const TARGET = "entros";
const HASH_CHARS = "0123456789abcdef";

function randomChar() {
  return HASH_CHARS[Math.floor(Math.random() * HASH_CHARS.length)];
}

function scrambleAll() {
  let s = "";
  for (let i = 0; i < TARGET.length; i++) s += randomChar();
  return s;
}

/**
 * Wordmark with a one-shot hash-shuffle reveal. Fires only on the very
 * first mount of the navbar in a session, and only if that mount is on
 * the home route. Client-side route changes don't remount the navbar
 * (it lives in the root layout), so this naturally never replays on
 * internal navigation.
 */
export function NavbarWordmark() {
  const [display, setDisplay] = useState(TARGET);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (window.location.pathname !== "/") return;

    setDisplay(scrambleAll());

    const TOTAL_FRAMES = 36;
    const FRAME_MS = 38;
    const settleAt = (i: number) =>
      Math.floor((i + 1) * (TOTAL_FRAMES / TARGET.length));

    let frame = 0;
    const id = window.setInterval(() => {
      frame++;
      let next = "";
      for (let i = 0; i < TARGET.length; i++) {
        next += frame >= settleAt(i) ? TARGET[i] : randomChar();
      }
      setDisplay(next);
      if (frame >= TOTAL_FRAMES) window.clearInterval(id);
    }, FRAME_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <Link
      href="/"
      className="font-mono text-xl font-bold tracking-tight text-foreground"
      aria-label="entros — home"
    >
      <span aria-hidden>{display}</span>
      <span className="text-cyan">.</span>
    </Link>
  );
}
