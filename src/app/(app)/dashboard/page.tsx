import type { Metadata } from "next";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { DashboardAnchorView } from "@/components/sections/dashboard-anchor-view";
import { DashboardHistory } from "@/components/sections/dashboard-history";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your IAM Anchor details, Trust Score, and verification history.",
};

export default function Dashboard() {
  return (
    <>
      <SubpageHero
        title="Your IAM Anchor"
        subtitle="Trust Score, verification history, and on-chain identity status."
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <DashboardAnchorView />
        <DashboardHistory />
      </section>
    </>
  );
}
