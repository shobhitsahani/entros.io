import type { NavItem } from "./types";

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Technology", href: "/technology" },
  { label: "Solutions", href: "/solutions" },
  { label: "Docs", href: "/docs", external: true },
  { label: "Paper", href: "/paper", external: true },
];

export const appNav: NavItem[] = [
  { label: "Verify", href: "/verify" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Integrate", href: "/integrate" },
];
