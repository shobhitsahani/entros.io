"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function SiteChrome({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const inDocs = pathname?.startsWith("/docs") ?? false;
  const inEmbed = pathname?.startsWith("/embed") ?? false;

  if (inDocs || inEmbed) return <>{children}</>;

  return (
    <>
      {navbar}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
