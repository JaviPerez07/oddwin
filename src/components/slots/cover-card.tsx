import Link from "next/link";
import { confirmedFacts } from "@/lib/facts";
import { mechanicInfo, signatureMechanic } from "@/lib/mechanics";
import { cn } from "@/lib/utils";
import type { Slot } from "@/types/slot";
import { SlotCover } from "./slot-cover";

/**
 * Catalogue card: the cover leads; name and studio second; mechanics (and any
 * verified figures) third. Unverified figures are never shown on cards.
 */
export function CoverCard({
  slot,
  providerName,
  variant = "default",
  className,
  priority,
}: {
  slot: Slot;
  providerName?: string;
  variant?: "default" | "feature";
  className?: string;
  priority?: boolean;
}) {
  const facts = confirmedFacts(slot);
  const feature = variant === "feature";

  return (
    <Link href={`/slots/${slot.slug}`} className={cn("group block", className)} data-testid="slot-card">
      <SlotCover
        artwork={slot.artwork}
        name={slot.name}
        provider={providerName}
        aspect={feature ? "16/9" : "4/3"}
        size={feature ? "lg" : "md"}
        priority={priority}
        mechanic={signatureMechanic(slot.mechanics)}
        sizes={feature ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
      />
      {/* The placeholder already shows name and studio; keep the heading for assistive tech only. */}
      <div className={slot.artwork.card ? "mt-3" : "sr-only"}>
        <h3 className={cn("font-semibold leading-tight text-fg transition-colors group-hover:text-accent", feature ? "text-xl" : "text-[1.02rem]")}>{slot.name}</h3>
        <p className="mt-0.5 text-sm text-fg-3">{providerName}</p>
      </div>
      {feature ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-2">{slot.shortDescription}</p> : null}
      {facts.length ? (
        <p className="figure mt-2 flex flex-wrap gap-x-3 text-xs text-fg-2">
          {facts.map((f) => (
            <span key={f.key}>
              <span className="text-fg-3">{f.label} </span>
              {f.text}
            </span>
          ))}
        </p>
      ) : null}
      <p className="mt-2.5 line-clamp-1 text-xs text-fg-3">{slot.mechanics.slice(0, feature ? 5 : 3).map((m) => mechanicInfo[m].label).join(" · ")}</p>
    </Link>
  );
}
