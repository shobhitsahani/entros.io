"use client";

import React, { useRef, useId, useEffect, useCallback, type CSSProperties } from "react";

interface AnimationConfig {
  scale: number;
  speed: number;
}

interface NoiseConfig {
  opacity: number;
  scale: number;
}

interface EtherealShadowProps {
  sizing?: "fill" | "stretch";
  color?: string;
  animation?: AnimationConfig;
  noise?: NoiseConfig;
  style?: CSSProperties;
  className?: string;
}

function mapRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
): number {
  if (fromLow === fromHigh) return toLow;
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

const MASK_IMAGE_URL =
  "https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png";
const NOISE_IMAGE_URL =
  "https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png";

// Target ~15fps instead of 60fps for the SVG filter update.
// The ambient effect doesn't need 60fps and this cuts CPU cost by ~75%.
const FRAME_INTERVAL_MS = 66;

export function EtherealShadow({
  sizing = "fill",
  color = "rgba(128, 128, 128, 1)",
  animation,
  noise,
  style,
  className,
}: EtherealShadowProps) {
  const rawId = useId();
  const id = `ethereal-${rawId.replace(/:/g, "")}`;
  const animationEnabled = animation != null && animation.scale > 0;
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const rafRef = useRef<number>(0);

  const displacementScale = animation
    ? mapRange(animation.scale, 1, 100, 10, 50)
    : 0;

  // Faster rotation: map speed 1-100 to 30s-3s per full cycle
  const cycleDuration = animation
    ? mapRange(animation.speed, 1, 100, 30, 3)
    : 30;

  const tick = useCallback(() => {
    if (!feColorMatrixRef.current) return;

    let lastTime = performance.now();
    let hue = 0;
    const degreesPerMs = 360 / (cycleDuration * 1000);

    function frame(now: number) {
      const delta = now - lastTime;

      if (delta >= FRAME_INTERVAL_MS) {
        hue = (hue + degreesPerMs * delta) % 360;
        feColorMatrixRef.current?.setAttribute("values", String(hue));
        lastTime = now;
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [cycleDuration]);

  useEffect(() => {
    if (!animationEnabled) return;
    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, [animationEnabled, tick]);

  // Higher base frequency = more visible turbulence detail
  const baseFreqX = animation
    ? mapRange(animation.scale, 0, 100, 0.003, 0.001)
    : 0.002;
  const baseFreqY = animation
    ? mapRange(animation.scale, 0, 100, 0.008, 0.004)
    : 0.006;

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -displacementScale,
          filter: animationEnabled ? `url(#${id}) blur(3px)` : "none",
          willChange: "filter",
        }}
      >
        {animationEnabled && (
          <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <defs>
              <filter id={id}>
                <feTurbulence
                  result="undulation"
                  numOctaves={1}
                  baseFrequency={`${baseFreqX},${baseFreqY}`}
                  seed={0}
                  type="turbulence"
                />
                <feColorMatrix
                  ref={feColorMatrixRef}
                  in="undulation"
                  type="hueRotate"
                  values="180"
                />
                <feColorMatrix
                  in="dist"
                  result="circulation"
                  type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="circulation"
                  scale={displacementScale}
                  result="dist"
                />
                <feDisplacementMap
                  in="dist"
                  in2="undulation"
                  scale={displacementScale}
                  result="output"
                />
              </filter>
            </defs>
          </svg>
        )}
        <div
          style={{
            backgroundColor: color,
            maskImage: `url('${MASK_IMAGE_URL}')`,
            WebkitMaskImage: `url('${MASK_IMAGE_URL}')`,
            maskSize: sizing === "stretch" ? "100% 100%" : "cover",
            WebkitMaskSize: sizing === "stretch" ? "100% 100%" : "cover",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {noise != null && noise.opacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${NOISE_IMAGE_URL}")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
