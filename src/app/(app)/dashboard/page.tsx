import type { Metadata } from "next";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { DashboardAnchorView } from "@/components/sections/dashboard-anchor-view";
import { DashboardHistory } from "@/components/sections/dashboard-history";
import { DashboardAgents } from "@/components/sections/dashboard-agents";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your Entros Anchor details, Trust Score, and verification history.",
};

export default function Dashboard() {
  return (
    <>
      <SubpageHero
        title="Your Entros Anchor"
        subtitle={"Trust Score, verification history,\nand on-chain identity status."}
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <DashboardAnchorView />
        <DashboardHistory />
        <DashboardAgents />
      </section>
    </>
  );
}
