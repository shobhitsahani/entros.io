import { SubpageHero } from "@/components/sections/subpage-hero";
import { IntegrateGuide } from "@/components/sections/integrate-guide";

export const metadata = {
  title: "Integrate",
  description: "Add IAM proof-of-personhood verification to your app in 5 lines of code.",
};

export default function Integrate() {
  return (
    <>
      <SubpageHero
        title="Integrate"
        subtitle="Add IAM verification to your app in 5 lines of code."
      />
      <div className="mx-auto max-w-5xl px-6 pb-16 overflow-x-hidden">
        <IntegrateGuide />
      </div>
    </>
  );
}
