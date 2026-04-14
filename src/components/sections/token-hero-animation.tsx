"use client";

import dynamic from "next/dynamic";

const TokenOrbitAnimation = dynamic(
  () =>
    import("@/components/ui/token-orbit-animation").then(
      (m) => m.TokenOrbitAnimation
    ),
  { ssr: false, loading: () => <div className="w-full max-w-[260px] aspect-[360/340]" /> }
);

export function TokenHeroAnimation() {
  return (
    <div className="mx-auto flex justify-center -mt-8 -mb-10">
      <TokenOrbitAnimation className="w-full max-w-[260px] h-auto" />
    </div>
  );
}
