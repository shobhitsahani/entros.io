import { SubpageHero } from "@/components/sections/subpage-hero";
import { IntegrateGuide } from "@/components/sections/integrate-guide";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Integrate",
  description: "Add Entros proof-of-personhood verification to your app in 5 lines of code.",
  path: "/integrate",
});

export default function Integrate() {
  return (
    <>
      <SubpageHero
        title="Integrate"
        subtitle="Add Entros verification to your app in 5 lines of code."
      />
      <div className="mx-auto max-w-5xl px-6 pb-16 overflow-x-hidden">
        <IntegrateGuide />
      </div>
    </>
  );
}
