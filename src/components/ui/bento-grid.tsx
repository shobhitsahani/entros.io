import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-auto grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  detail,
  href,
  cta,
}: {
  name: string;
  className: string;
  background?: ReactNode;
  Icon: React.ElementType;
  description: string;
  detail?: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      "bg-surface border border-border transition-colors duration-300",
      "hover:border-border-hover",
      className
    )}
  >
    <div>{background}</div>

    <div className="z-10 flex flex-col gap-1.5 p-6">
      <Icon className="mb-1 h-7 w-7 text-foreground/40" strokeWidth={1.5} />
      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <p className="max-w-lg text-sm text-foreground/60">{description}</p>
      {detail && (
        <p className="mt-1 max-w-lg text-sm leading-relaxed text-foreground/45 opacity-100 lg:opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100">
          {detail}
        </p>
      )}
    </div>

    <div className="flex w-full items-center border-t border-border px-6 py-3 opacity-100 lg:opacity-60 transition-opacity duration-200 lg:group-hover:opacity-100">
      <a href={href} className="inline-flex items-center text-sm text-foreground/70 transition-colors hover:text-foreground">
        {cta}
        <ArrowRight className="ml-2 h-4 w-4" />
      </a>
    </div>
  </div>
);

export { BentoCard, BentoGrid };
