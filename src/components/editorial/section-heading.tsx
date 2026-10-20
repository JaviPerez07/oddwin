import Link from "next/link";
import { cn } from "@/lib/utils";

export function SectionHeading({
  label,
  title,
  description,
  href,
  hrefLabel,
  className,
  as: Tag = "h2",
}: {
  label?: string;
  title?: React.ReactNode;
  description?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
      <div className="min-w-0 max-w-3xl">
        {label ? <p className="label text-accent">{label}</p> : null}
        {title ? <Tag className="headline mt-2 text-[1.75rem] sm:text-[2.1rem]">{title}</Tag> : null}
        {description ? <p className="mt-2 text-fg-2">{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="text-sm font-semibold text-fg-2 transition-colors hover:text-accent">
          {hrefLabel ?? "Ver todos"} →
        </Link>
      ) : null}
    </div>
  );
}
