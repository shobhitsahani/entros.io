import type { Metadata } from "next";
import { SITE_NAME } from "./site";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
};

/**
 * Build per-page metadata with canonical and openGraph.url scoped to the page.
 * Without this, Next.js shallow-inherits root openGraph fields, making every
 * page's social share card claim the homepage URL.
 */
export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const shareTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      title: shareTitle,
      description,
    },
  };
}
