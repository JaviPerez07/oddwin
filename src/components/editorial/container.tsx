import { cn } from "@/lib/utils";

export function Container({ className, children, as: Tag = "div", id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }: { className?: string; children: React.ReactNode; as?: "div" | "section" | "header" | "article"; id?: string; "aria-label"?: string; "aria-labelledby"?: string }) {
  return <Tag id={id} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} className={cn("mx-auto w-full max-w-[84rem] px-4 sm:px-6 lg:px-8", className)}>{children}</Tag>;
}
