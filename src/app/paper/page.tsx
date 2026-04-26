import fs from "fs";
import path from "path";
import { PaperContent } from "./paper-content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Research Paper",
  description:
    "Entros Protocol: Proof-of-Personhood through Temporal Biometric Consistency",
  path: "/paper",
});

export default function PaperPage() {
  const paperPath = path.join(process.cwd(), "src", "content", "paper.md");
  const content = fs.readFileSync(paperPath, "utf-8");

  return <PaperContent content={content} />;
}
