"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageWrapper } from "@/components/layout/page-wrapper";

export function PaperContent({ content }: { content: string }) {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-3xl mb-8 flex justify-end gap-3">
        <a
          href="https://doi.org/10.5281/zenodo.19517441"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-mono text-foreground/70 transition-colors hover:text-foreground hover:border-border-hover"
        >
          Zenodo DOI
          <span aria-hidden="true">↗</span>
        </a>
        <a
          href="/entros-protocol-2026.pdf"
          download
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-mono text-foreground/70 transition-colors hover:text-foreground hover:border-border-hover"
        >
          Download PDF
          <span aria-hidden="true">↓</span>
        </a>
      </div>
      <article className="mx-auto max-w-3xl space-y-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="font-mono text-3xl font-bold text-foreground mb-6">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-mono text-2xl font-bold text-foreground mt-12 mb-4">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-mono text-xl font-semibold text-foreground mt-8 mb-3">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="font-mono text-lg font-semibold text-foreground mt-6 mb-2">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-foreground/80 leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 space-y-1 text-foreground/80">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 space-y-1 text-foreground/80">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-cyan pl-4 italic text-foreground/60">
                {children}
              </blockquote>
            ),
            code: ({ children, className }) => {
              const isBlock = className?.startsWith("language-");
              if (isBlock) {
                return (
                  <code className="block rounded-lg bg-code-bg p-4 text-sm font-mono overflow-x-auto">
                    {children}
                  </code>
                );
              }
              return (
                <code className="rounded bg-code-bg px-1.5 py-0.5 text-sm font-mono">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => <pre className="my-4">{children}</pre>,
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="w-full border-collapse text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="border-b border-border">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 text-left font-mono text-xs uppercase tracking-widest text-muted">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 text-foreground/80 border-b border-border/50">
                {children}
              </td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-cyan hover:text-foreground transition-colors underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="border-border my-8" />,
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">{children}</strong>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </PageWrapper>
  );
}
