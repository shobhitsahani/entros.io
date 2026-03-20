import { ArrowRight } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CodeBlock } from "@/components/ui/code-block";
import { sdkSnippet } from "@/data/developer-snippet";

export function ForDevelopersSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
        duration={3}
      >
        {"// FOR DEVELOPERS"}
      </TextShimmer>

      <h2 className="mt-6 font-sans text-2xl font-semibold text-foreground">
        {sdkSnippet.title}
      </h2>

      <div className="mt-8">
        <CodeBlock code={sdkSnippet.code} />
        <div className="mt-4 font-mono text-sm text-muted">
          <span className="text-subtle">$</span> {sdkSnippet.installCommand}
        </div>
      </div>

      <a
        href="/integrate"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-muted transition-all duration-200 hover:border-border-hover hover:text-foreground"
      >
        Read the Docs
        <ArrowRight className="h-4 w-4" />
      </a>
    </section>
  );
}
