"use client";

import dynamic from "next/dynamic";

const SolutionsNetworkAnimation = dynamic(
  () =>
    import("@/components/ui/solutions-network-animation").then(
      (m) => m.SolutionsNetworkAnimation
    ),
  { ssr: false, loading: () => <div className="w-full max-w-[260px] aspect-[360/340]" /> }
);

export function SolutionsHeroAnimation() {
  return (
    <div className="mx-auto flex justify-center -mt-8 -mb-10">
      <SolutionsNetworkAnimation className="w-full max-w-[260px] h-auto" />
    </div>
  );
}
