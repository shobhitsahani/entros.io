import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";
import { protocolComponents } from "@/data/protocol-components";
import { getIcon } from "@/lib/icons";

export function ProtocolComponentsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
        duration={3}
      >
        {"// PROTOCOL COMPONENTS"}
      </TextShimmer>

      <h2 className="mt-6 font-sans text-2xl font-semibold text-foreground md:text-3xl">
        Four layers, one proof
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {protocolComponents.map((component) => {
          const Icon = getIcon(component.icon);
          return (
            <GlowCard key={component.title} className="flex flex-col">
              <Icon
                className="mb-4 h-8 w-8 text-foreground/50"
                strokeWidth={1.5}
              />
              <h3 className="font-sans text-xl font-semibold text-foreground">
                {component.title}
              </h3>
              <p className="mt-1 text-sm text-cyan font-mono">
                {component.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                {component.description}
              </p>
              <ul className="mt-4 space-y-2">
                {component.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-sm text-foreground/40"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan" />
                    {highlight}
                  </li>
                ))}
              </ul>
              {component.links && component.links.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border flex gap-4">
                  {component.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
                    >
                      {link.label}
                      <span className="text-xs" aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </GlowCard>
          );
        })}
      </div>
    </section>
  );
}
