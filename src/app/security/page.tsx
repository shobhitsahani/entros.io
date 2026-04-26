import Link from "next/link";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { ThreatModel } from "./sections/ThreatModel";
import { DefenseLayers } from "./sections/DefenseLayers";
import { RedTeamProgram } from "./sections/RedTeamProgram";
import { LatestResults } from "./sections/LatestResults";
import { OpenSourcePosture } from "./sections/OpenSourcePosture";
import { ResponsibleDisclosure } from "./sections/ResponsibleDisclosure";
import { References } from "./sections/References";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Security Program",
  description:
    "Continuous adversarial testing against state-level synthesis attacks. Methodology public, defenses layered, results measured.",
  path: "/security",
});

export default function Security() {
  return (
    <>
      <SubpageHero
        title="Security Program"
        subtitle={"Continuous adversarial testing against state-level synthesis attacks.\nMethodology public, defenses layered, results measured."}
      />
      <ThreatModel />
      <DefenseLayers />
      <RedTeamProgram />
      <LatestResults />
      <OpenSourcePosture />
      <ResponsibleDisclosure />
      <References />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <hr className="mx-auto mb-16 w-24 border-t border-foreground/[0.06]" />
        <p className="font-mono text-xl tracking-[0.02em] text-foreground md:text-2xl">
          Read the research behind our verification pipeline.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/paper">
            <ShimmerButton className="text-sm font-medium lg:text-base">
              <span className="flex items-center gap-2">
                Read the Paper
                <span aria-hidden="true">&rarr;</span>
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </section>
    </>
  );
}
