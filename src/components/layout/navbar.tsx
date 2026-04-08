import Link from "next/link";
import { mainNav } from "@/data/navigation";
import { MobileNav } from "./mobile-nav";
import { NavDropdown } from "./nav-dropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const solutionsDropdown = [
  { label: "Use Cases", href: "/solutions" },
  { label: "Agent Anchor", href: "/agents" },
  { label: "Integrate", href: "/integrate" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-background md:bg-background/80 md:backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        <Link
          href="/"
          className="font-mono text-xl font-bold text-foreground tracking-tight"
        >
          IAM<span className="text-cyan">.</span>
        </Link>

        <ul className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-8 md:flex">
          {mainNav.map((item) =>
            item.label === "Solutions" ? (
              <li key={item.href}>
                <NavDropdown label="Solutions" items={solutionsDropdown} />
              </li>
            ) : (
              <li key={item.href}>
                {item.external ? (
                  <a
                    href={item.href}
                    className="text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground py-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground py-2"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          )}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center rounded-full px-4 py-1.5 text-sm font-mono font-medium border border-border bg-surface/50 backdrop-blur-md text-foreground/60 hover:text-foreground hover:bg-surface-hover transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            href="/verify"
            className="hidden md:inline-flex items-center rounded-full px-4 py-1.5 text-sm font-mono font-medium border border-border bg-surface/50 backdrop-blur-md text-cyan hover:text-foreground hover:bg-surface-hover transition-colors duration-200"
          >
            Verify
          </Link>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
